from django.urls import path,include
from rest_framework_nested import routers
from . import views
from pprint import pprint
from .views import CartItemViewSet

router=routers.DefaultRouter()
router.register('courses',views.CourseViewSet,basename='courses')
router.register('courseses/l',views.CourseViewSetLecturer,basename='courses-lecturer')
router.register('collections',views.collectionViewSet)
router.register('student',views.StudentViewSet)
router.register('lecturer',views.LeturerViewSet)
router.register('cart',views.CartViewSet,basename='cart')
router.register('orders',views.OrderViewSet,basename='orders')
router.register('courseses/s',views.StudentCourseViewSet,basename='orders')

#router.register('customer-reviews',views.StudentReviewsViewSet)

product_router=routers.NestedDefaultRouter(router,'courses',lookup='course')
product_router.register('reviews',views.ReviewsViewSet,basename='course-reviews')
product_router.register('aims',views.CourseAimViewSet,basename='course-aims')
product_router.register('contents',views.CourseContentsViewSet,basename='course-contents')
product_router.register('tutorials',views.CourseTutorialViewSet,basename='course-tutorials')
product_router.register('documents',views.CourseDocumentViewSet,basename='course-documents')


cart_router=routers.NestedDefaultRouter(router,'cart',lookup='cart')
cart_router.register('items',views.CartItemViewSet,basename='cart-items')

#pprint(router.urls)



urlpatterns = [
    path('',include(router.urls)),
    path('',include(product_router.urls)),
    path('',include(cart_router.urls)),
    
    #path('cart/<str:cart_pk>/items/<str:method>/', views.CartItemViewSet.as_view({'post': 'get_serializer_contex'}), name='cart-item-create'),
    

    
   
]

#path('emails/',views.SendEmails.as_view())

'''[<URLPattern '^product/$' [name='product-list']>,
 <URLPattern '^product/(?P<pk>[^/.]+)/$' [name='product-detail']>,
 <URLPattern '^collections/$' [name='collection-list']>,
 <URLPattern '^collections/(?P<pk>[^/.]+)/$' [name='collection-detail']>]'''