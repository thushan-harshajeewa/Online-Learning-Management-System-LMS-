from django.shortcuts import render,get_object_or_404
from django.db.models import Count
from rest_framework.response import Response
from rest_framework.decorators import api_view,action
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated,IsAdminUser,AllowAny
from rest_framework import status
from rest_framework.generics import ListCreateAPIView,mixins,GenericAPIView
from rest_framework.viewsets import ModelViewSet,GenericViewSet
from .models import Course,Collection,OrderItem,Student,Order,Reviews,Cart,CartItem,Lecturer,CourseAim,CourseContents,CourseTutorials,CourseDocuments
from .serializer import StudentSerializerGet,StudentImageSerializer,CourseSerializer,collectionSerializer,\
                        StudentSerializer,LecturerSerializerGet,\
                        OrderSerializer,ReviewsSerializer,CartSerializer,\
                        CartItemSerializer,AddCartItemsSerializer,CreateOrderSerializer,UpdateOrderSerializer,CourseImageSerializer,LecturerSerializer,\
                        CourseAimSerializer,CourseContentsSerializer,CourseImageSerializer,CourseDocumentSerializer,CourseTutorialSerializer,StudentCourseSerializer
from .permission import IsAdminAndReadOnly,IsAdminIsAuthenticatedAndReadOnly
from django_filters.rest_framework import DjangoFilterBackend 
from rest_framework.filters import SearchFilter,OrderingFilter
from .filters import CourseFilter
from templated_mail.mail import BaseEmailMessage




class CourseViewSet(ModelViewSet):
    http_method_names=['get','post','patch','delete','head','options','put']
    queryset=Course.objects.all()
    filter_backends=[DjangoFilterBackend,SearchFilter,OrderingFilter]
    filterset_class=CourseFilter
    search_fields = ['title']
    ordering_fields = ['unit_price']

    def get_serializer_class(self):

        if self.request.method=='PATCH':
            return CourseImageSerializer
        
        return CourseSerializer

    


    def get_serializer_context(self):
        return{'request':self.request,'user_id':self.request.user.id}
   
    def destroy(self, request, *args, **kwargs):
        if Course.objects.filter(orderitem__course_id=kwargs['pk']).count()>0:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        return  super().destroy(request,{'w':'Course deleted'}, *args, **kwargs)
    

  

class CourseViewSetLecturer(ModelViewSet):
    http_method_names=['get','post','patch','delete','head','options','put']
    queryset=Course.objects.all()

    
    filter_backends=[DjangoFilterBackend,SearchFilter,OrderingFilter]
    filterset_class=CourseFilter
    search_fields = ['title']
    ordering_fields = ['unit_price']

    def get_queryset(self):
        lecturer=Lecturer.objects.get(user_id=self.request.user.id)
        
        return Course.objects.filter(lecturer=lecturer)

    def get_serializer_class(self):

        if self.request.method=='PATCH':
            return CourseImageSerializer
        
        return CourseSerializer

    


    def get_serializer_context(self):
        return{'request':self.request,'user_id':self.request.user.id}
   
    def destroy(self, request, *args, **kwargs):
        if Course.objects.filter(orderitem__course_id=kwargs['pk']).count()>0:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        return  super().destroy(request,{'w':'Course deleted'}, *args, **kwargs)



'''class CourseImageViewSet(ModelViewSet):
    serializer_class=CourseImageSerializer

    def get_queryset(self):
        return CourseImage.objects.filter(course=self.kwargs['course_pk'])
    
    def get_serializer_context(self):
        return {'course_id':self.kwargs['course_pk']}
    

    

    def delete(self,request,id):
        product=get_object_or_404(Product,pk=id)
        if product.orderitem_set.count()>0:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        serialize=product.delete()
        return Response({'error':'Product is deleted'})'''
    



class collectionViewSet(ModelViewSet):
    queryset=Collection.objects.annotate(course_count=Count('courses')).all()
    serializer_class=collectionSerializer
    permission_classes=[IsAdminAndReadOnly]

    def delete(self,request,pk):
        collection=get_object_or_404(Collection,pk=pk)
        if collection.courses.count()>0:
            return Response({'warning':'cannot be deleted'},status=status.HTTP_405_METHOD_NOT_ALLOWED)
        collection.delete()
        return Response({'error':'Course is deleted'})
    


class StudentViewSet(ModelViewSet):
     queryset=Student.objects.all()
     serializer_class=StudentSerializer
     permission_classes=[IsAdminUser]


         

     @action(detail=False,methods=['GET','PUT','PATCH'],permission_classes=[IsAuthenticated])
     def me(self,request):
          (student,create)=Student.objects.get_or_create(user_id=request.user.id)
          if request.method=='GET':
            serialize=StudentSerializerGet(student)
            return Response(serialize.data)
          
          elif request.method=='PUT':
              serialize=StudentSerializer(student,data=request.data)
              serialize.is_valid(raise_exception=True)
              serialize.save()
              return Response(serialize.data)
          elif request.method=='PATCH':
              serialize=StudentImageSerializer(student,data=request.data)
              serialize.is_valid(raise_exception=True)
              serialize.save()
              return Response(serialize.data)

     @action(detail=True)     
     def myprofile(self,request):
         return Response('Ok')
     

class LeturerViewSet(ModelViewSet):
     queryset=Lecturer.objects.all()
     serializer_class=LecturerSerializer
     permission_classes=[IsAdminUser]


         

     @action(detail=False,methods=['GET','PUT','PATCH'],permission_classes=[IsAuthenticated])
     def me(self,request):
          (lecturer,create)=Lecturer.objects.get_or_create(user_id=request.user.id)
          if request.method=='GET':
            serialize=LecturerSerializerGet(lecturer)
            return Response(serialize.data)
          
          elif request.method=='PUT':
              serialize=LecturerSerializer(lecturer,data=request.data)
              serialize.is_valid(raise_exception=True)
              serialize.save()
              return Response(serialize.data)
          elif request.method=='PATCH':
              serialize=StudentImageSerializer(lecturer,data=request.data)
              serialize.is_valid(raise_exception=True)
              serialize.save()
              return Response(serialize.data)
        
          

class ReviewsViewSet(ModelViewSet):
    #permission_classes=[IsAdminIsAuthenticatedAndReadOnly]
    serializer_class=ReviewsSerializer
    
    def get_queryset(self):
        return Reviews.objects.filter(course_id=self.kwargs['course_pk'])
    
    def get_serializer_context(self):
        user_id=self.request.user.id
        return {'course_pk':self.kwargs['course_pk'],'user_id':user_id}
    

class CartViewSet(mixins.CreateModelMixin,mixins.RetrieveModelMixin,GenericViewSet,mixins.DestroyModelMixin):
    queryset=Cart.objects.prefetch_related('items__course')
    serializer_class=CartSerializer
    
    def create(self, request, *args, **kwargs):
        serializer=CartSerializer(data=request.data,context={'user_id':self.request.user.id})
        serializer.is_valid(raise_exception=True)
        cart=serializer.save()
        serializer=CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    '''def get_serializer_class(self):
        if self.request.method=='POST':
            return CartCreateSerializer
        return CartSerializer'''
    

    
    '''def get_serializer_context(self):
        return {"user_id":self.request.user.id}'''
              
    


class CartItemViewSet(ModelViewSet):
    http_method_names=['get','post','delete']
    def get_queryset(self):
        return CartItem.objects.filter(cart_id=self.kwargs['cart_pk']).select_related('course')
    
    def get_serializer_class(self):
        
        if self.request.method=='POST':
            return AddCartItemsSerializer

        return CartItemSerializer

    def get_serializer_context(self):
        return {'cart_id':self.kwargs['cart_pk']}
    

class OrderViewSet(ModelViewSet):

    http_method_names=['get','post','patch','delete','head','options']

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        (student,created)=Student.objects.get_or_create(user_id=self.request.user.id)
        return Order.objects.filter(student=student)
    
    def create(self, request, *args, **kwargs):
        serializer=CreateOrderSerializer(data=request.data,context={'user_id':self.request.user.id})
        serializer.is_valid(raise_exception=True)
        order=serializer.save()
        print(order)
        serializer=OrderSerializer(order)
        return Response(serializer.data)

    
    def get_serializer_class(self):
        if self.request.method=='POST':
            return CreateOrderSerializer
        elif self.request.method=="PATCH":
            return UpdateOrderSerializer
        return OrderSerializer
    
    def get_permissions(self):
        if self.request.method in ['DELETE','PATCH']:
            return [IsAdminUser()]
        return [IsAuthenticated()]
    


class CourseAimViewSet(ModelViewSet):
    serializer_class=CourseAimSerializer
    def get_queryset(self):
        course_id=self.kwargs['course_pk']
        return CourseAim.objects.filter(course_id=course_id)
    def get_serializer_context(self):
        return {'course_id':self.kwargs['course_pk']}
    

class CourseContentsViewSet(ModelViewSet):
    serializer_class=CourseContentsSerializer
    def get_queryset(self):
        course_id=self.kwargs['course_pk']
        return CourseContents.objects.filter(course_id=course_id)
    def get_serializer_context(self):
        return {'course_id':self.kwargs['course_pk']}
    

class CourseTutorialViewSet(ModelViewSet):
    serializer_class=CourseTutorialSerializer
    def get_queryset(self):
        course_id=self.kwargs['course_pk']
        return CourseTutorials.objects.filter(course_id=course_id)
    def get_serializer_context(self):
        return {'course_id':self.kwargs['course_pk']}
    

class CourseDocumentViewSet(ModelViewSet):
    serializer_class=CourseDocumentSerializer
    def get_queryset(self):
        course_id=self.kwargs['course_pk']
        return CourseDocuments.objects.filter(course_id=course_id)
    def get_serializer_context(self):
        return {'course_id':self.kwargs['course_pk']}
    

class StudentCourseViewSet(ModelViewSet):
    serializer_class=StudentCourseSerializer
    def get_queryset(self):
        user_id=self.request.user.id
        student=Student.objects.get(user_id=user_id)
        order_id=Order.objects.filter(student=student,order_status='C')
        return OrderItem.objects.filter(order__in=order_id)

    




'''def Send_Email(request):
    queryset=Product.objects.filter(collection_id=3)

    return render(request, 'hello.html', {'products': queryset})

class SendEmails(APIView):
    def post(self,request,format=None):
            user_id=self.request.user.email
            user_name=self.request.user.first_name
            
            print(user_id)

            
            try:
                message=BaseEmailMessage(template_name='Emails/email.html',context={'name':user_name})
                message.send([f"{user_id}"])
            except :
                    pass
            return Response(f'{user_id}')'''
    











'''
class ProductName(APIView):
    def get(self,request,id):
        product=get_object_or_404(Product,pk=id)
        serialize=productSerializer(product,context={'request': request})
        return Response(serialize.data)
    
    def put(self,request,id):
        product=get_object_or_404(Product,pk=id)
        serialize=productSerializer(product,data=request.data)
        serialize.is_valid(raise_exception=True)
        serialize.save()
        return Response(serialize.data,status=status.HTTP_426_UPGRADE_REQUIRED)
    
    def delete(self,request,id):
        product=get_object_or_404(Product,pk=id)
        if product.orderitem_set.count()>0:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        serialize=product.delete()
        return Response({'error':'Product is deleted'})'''



'''class ProductList(ListCreateAPIView):
    queryset=Product.objects.select_related('collection').all()
    serializer_class=productSerializer
    #def get_queryset(self):
            #return Product.objects.select_related('collection').all()
        
    #def get_serializer_class(self):
            #return productSerializer
        
    def get_serializer_context(self):
            return {'request':self.request}'''
        
'''class ProductList(APIView):
    def get(self,request):
        product=Product.objects.select_related('collection').all()
        serialize=productSerializer(product,many=True,context={'request': request})
        return Response(serialize.data)
    
    def post(self,request):
        serialize=productSerializer(data=request.data)
        serialize.is_valid(raise_exception=True)
        serialize.save()
        return Response(serialize.data)'''








'''@api_view(['GET','PUT','DELETE'])
def collection_details(request,pk):
    collection=get_object_or_404(Collection,pk=pk)
    if request.method=='GET':
        serialize=collectionSerializer(collection)
        return Response(serialize.data)
    
    if request.method=='PUT':
        serialize=collectionSerializer(collection,data=request.data)
        serialize.is_valid(raise_exception=True)
        serialize.save()
        return Response(serialize.data,status=status.HTTP_426_UPGRADE_REQUIRED)
    
    if request.method=='DELETE':
        if collection.products.count()>0:
            return Response({'warning':'cannot be deleted'},status=status.HTTP_405_METHOD_NOT_ALLOWED)

        collection.delete()
        return Response({'error':'Item is deleted'})


    

class CollectionList(ListCreateAPIView):

    queryset=Collection.objects.annotate(product_count=Count('products')).all()
    serializer_class=collectionSerializer'''
    







'''@api_view(['GET','POST'])
def Collection_list(request):
    collection=Collection.objects.annotate(product_count=Count('product')).all()
    if request.method=="GET":
        serialize=collectionSerializer(collection,many=True)
        return Response(serialize.data)
    
    elif request.method=='POST':
        serialize=collectionSerializer(request.data)
        serialize.is_valid(raise_exception=True)
        serialize.save()
        return Response(serialize.data,status=status.HTTP_201_CREATED)'''


        
    



