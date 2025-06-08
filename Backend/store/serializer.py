from django.db import transaction
from rest_framework import serializers
from .models import Course, Collection, Student, Order, OrderItem, Reviews, Cart, CartItem,Lecturer,\
            CourseAim,CourseContents,CourseDocuments,CourseTutorials
                

from decimal import Decimal
from core.serializers import UserSerializer


class collectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ['id', 'title', 'product_count']
    product_count = serializers.IntegerField(read_only=True)


'''class CourseImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseImage
        fields = ['id', 'image']

    def create(self, validated_data):
        course_id = self.context['course_id']
        return CourseImage.objects.create(course_id=course_id, **validated_data)'''


class CourseSerializer(serializers.ModelSerializer):

    image=serializers.ImageField(read_only=True)    

    class Meta:
        model = Course
        fields = ['id', 'title', 'unit_price', 'description',
                  'collection', 'unit_price_with_tax', 'image']

    # price=serializers.DecimalField(max_digits=10,decimal_places=7,source='unit_price')
    unit_price_with_tax = serializers.SerializerMethodField(
        method_name='get_unit_price_with_tax')
    # collection=serializers.HyperlinkedRelatedField(queryset=Collection.objects.all()
    # , view_name='collection_details')

    def get_unit_price_with_tax(self, course: Course):
        return course.unit_price * Decimal(2.5)
    
    def create(self, validated_data):
        user_id=self.context['user_id']
        lecturer=Lecturer.objects.get(user_id=user_id)
        return Course.objects.create(lecturer=lecturer,**validated_data)


class StudentReviewSerializer(serializers.ModelSerializer):

    user = UserSerializer(read_only=True)

    class Meta:
        model = Student

        fields = ['id', 'phone', 'birth_date', 'image', 'user']


class ReviewsSerializer(serializers.ModelSerializer):

    student = StudentReviewSerializer(read_only=True)

    class Meta:
        model = Reviews
        fields = ['id', 'description', 'date', 'student']

    def create(self, validated_data):
        student_id = Student.objects.get(user_id=self.context['user_id'])
        return Reviews.objects.create(course_id=self.context['course_pk'], student=student_id, **validated_data)


class StudentSerializerGet(serializers.ModelSerializer):
    user_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Student

        fields = ['id', 'user_id', 'phone', 'birth_date', 'address', 'image']


class StudentSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Student

        fields = ['id', 'user_id', 'phone', 'birth_date', 'address']
    
class LecturerSerializerGet(serializers.ModelSerializer):
    user_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Lecturer

        fields = ['id', 'user_id', 'phone', 'birth_date', 'address', 'image']




class StudentImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Student

        fields = ['image']

class LecturerSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Lecturer

        fields = ['id', 'user_id', 'phone', 'birth_date', 'address']


class CartCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'title', 'unit_price','description','image']


class CartItemSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    Total_price = serializers.SerializerMethodField()

    def get_Total_price(self, cartitem: CartItem):
        return cartitem.unit_price

    class Meta:
        model = CartItem
        fields = ['id', 'course', 'unit_price', 'Total_price']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    id = serializers.UUIDField(read_only=True)
    Total_price = serializers.SerializerMethodField()

    def get_Total_price(self, cart: Cart):
        return sum([item.unit_price for item in cart.items.all()])

    class Meta:
        model = Cart
        fields = ['id', 'created_at', 'items', 'Total_price']

    def save(self, **kwargs):
        with transaction.atomic():
            user = self.context['user_id']
            if user:
                (student, create) = Student.objects.get_or_create(user_id=user)
                (cart, create) = Cart.objects.get_or_create(student=student)
                return cart
            cart = Cart.objects.create(student=None)
            return cart


class AddCartItemsSerializer(serializers.ModelSerializer):
    course_id = serializers.IntegerField()
    unit_price = serializers.DecimalField(
        max_digits=10, decimal_places=3, read_only=True)

    def validate_course_id(self, value):
        if not Course.objects.filter(pk=value).exists():
            raise serializers.ValidationError('No Product With the Id')
        #if CartItem.objects.all().count()>=1:
            #raise serializers.ValidationError('You cant add')
        return value

    class Meta:
        model = CartItem
        fields = ['id', 'course_id', 'unit_price']

    def save(self, **kwargs):
        cart_id = self.context['cart_id']
        course_id = self.validated_data['course_id']
        course = Course.objects.get(id=course_id)

        try:
            cart_item = CartItem.objects.get(
                cart_id=cart_id, course_id=course_id)
            cart_item.save()
            self.instance = cart_item
            return self.instance

        except:

            cart_item = CartItem.objects.create(
                cart_id=cart_id, unit_price=course.unit_price, **self.validated_data)
            self.instance = cart_item
            return self.instance


'''class SpecialCartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model=CartItem
        fields=['quantity']'''


class OrderItemSerializer(serializers.ModelSerializer):
    course = CartCourseSerializer()

    class Meta:
        model = OrderItem
        fields = ['id', 'course', 'unit_price', 'order_id']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    student_id = serializers.IntegerField(read_only=True)
    Total_price = serializers.SerializerMethodField()

    def get_Total_price(self, order: Order):
        return sum([item.unit_price for item in order.items.all()])

    class Meta:
        model = Order
        fields = ['id', 'placed_at', 'order_status',
                  'student_id', 'items', 'Total_price']


class CreateOrderSerializer(serializers.Serializer):
    cart_id = serializers.UUIDField()
    

    def validate_cart_id(self, data):
        if not Cart.objects.filter(pk=data).exists():
            raise serializers.ValidationError('No Cart ID')
        if CartItem.objects.filter(cart=data).count() == 0:
            raise serializers.ValidationError('Cart has no Items')
        return data

    def save(self, **kwargs):

        with transaction.atomic():
            (student, created) = Student.objects.get_or_create(
                user_id=self.context['user_id'])
            order = Order.objects.create(
                student=student)
            cartitem = CartItem.objects.select_related(
                'course').filter(cart=self.validated_data['cart_id'])
            # [OrderItem.objects.create(order=order,quantity=item.quantity,
            # unit_price=item.product.unit_price,product_id=item.product.pk) for item in cartitem]
            item_list = [OrderItem(
                order=order, unit_price=item.unit_price, course=item.course) for item in cartitem]
            OrderItem.objects.bulk_create(item_list)
            Cart.objects.get(pk=self.validated_data['cart_id']).delete()
            return order


class UpdateOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['payment_status']



class CourseAimSerializer(serializers.ModelSerializer):
    class Meta:
        model=CourseAim
        fields =['id','description']

    def create(self, validated_data):
        course_id=self.context['course_id']
        return CourseAim.objects.create(course_id=course_id,**validated_data) 

class CourseContentsSerializer(serializers.ModelSerializer):
    class Meta:
        model=CourseContents
        fields=['id','description']
    
    def create(self, validated_data):
        course_id=self.context['course_id']
        return CourseContents.objects.create(course_id=course_id,**validated_data) 
    
class CourseImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Course
        fields = ['image']

class CourseTutorialSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseTutorials
        fields = ['id', 'title','video']

    def create(self, validated_data):
        course_id = self.context['course_id']
        return CourseTutorials.objects.create(course_id=course_id, **validated_data)
    

class CourseDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseDocuments
        fields = ['id', 'title','pdf']

    def create(self, validated_data):
        course_id = self.context['course_id']
        return CourseDocuments.objects.create(course_id=course_id, **validated_data)
    

class StudentCourseSerializer(serializers.ModelSerializer):
    course = CartCourseSerializer()

    class Meta:
        model = OrderItem
        fields = ['id', 'course', 'unit_price', 'order_id']
        
