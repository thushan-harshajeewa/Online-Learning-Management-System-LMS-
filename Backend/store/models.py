from django.core.validators import MinValueValidator
from django.db import models
from django.conf import settings
from uuid import uuid4


'''class Promotion(models.Model):
    description = models.CharField(max_length=255)
    discount = models.FloatField()'''


class Collection(models.Model):
    title = models.CharField(max_length=255)
    '''featured_product = models.ForeignKey(
        'Product', on_delete=models.SET_NULL, null=True, related_name='+', blank=True)'''

    def __str__(self) -> str:
        return self.title

    class Meta:
        ordering = ['title']

class Lecturer(models.Model):

    #first_name = models.CharField(max_length=255)
    #last_name = models.CharField(max_length=255)
    #email = models.EmailField(unique=True)
    phone = models.CharField(max_length=255, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    address=models.CharField(max_length=255,null=True)
    user=models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,default=1)
    image=models.ImageField(upload_to='store/student/images',default='NO',blank=True)

    def __str__(self):
        return f'{self.user.first_name} {self.user.last_name}'
    
    def first_name(self):
        return self.user.first_name
    
    def last_name(self):
        return self.user.last_name

    class Meta:
        ordering = ['user__first_name', 'user__last_name']


class Course(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(default='')
    description = models.TextField(null=True, blank=True)
    unit_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(1)],default=1)
    #full_price=models.DecimalField(max_digits=6,decimal_places=2,validators=[MinValueValidator(1)],default=100)
    #inventory = models.IntegerField(validators=[MinValueValidator(0)])
    last_update = models.DateTimeField(auto_now=True)
    collection = models.ForeignKey(Collection, on_delete=models.PROTECT,related_name='courses')
    lecturer=models.ForeignKey(Lecturer,on_delete=models.CASCADE,null=True)
    image=models.ImageField(upload_to='store/courses/images',default='NO',blank=True)
    

    def __str__(self) -> str:
        return self.title

    class Meta:
        ordering = ['title']

'''class CourseImage(models.Model):
    course=models.ForeignKey(Course,on_delete=models.CASCADE,related_name='images')
    image=models.ImageField(upload_to='store/product/images')'''


class Student(models.Model):

    #first_name = models.CharField(max_length=255)
    #last_name = models.CharField(max_length=255)
    #email = models.EmailField(unique=True)
    phone = models.CharField(max_length=255, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    address=models.CharField(max_length=255,null=True)
    user=models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,default=1)
    image=models.ImageField(upload_to='store/student/images',default='NO',blank=True)

    def __str__(self):
        return f'{self.user.first_name} {self.user.last_name}'
    
    def first_name(self):
        return self.user.first_name
    
    def last_name(self):
        return self.user.last_name

    class Meta:
        ordering = ['user__first_name', 'user__last_name']

class CourseAim(models.Model):
    description=models.TextField(null=True)
    course=models.ForeignKey(Course,on_delete=models.CASCADE,null=True)

class CourseContents(models.Model):
    description=models.TextField(null=True)
    course=models.ForeignKey(Course,on_delete=models.CASCADE,null=True)








class Order(models.Model):
    PAYMENT_STATUS_PENDING = 'P'
    PAYMENT_STATUS_COMPLETE = 'C'
    PAYMENT_STATUS_FAILED = 'F'
    PAYMENT_STATUS_CHOICES = [
        (PAYMENT_STATUS_PENDING, 'Pending'),
        (PAYMENT_STATUS_COMPLETE, 'Complete'),
        (PAYMENT_STATUS_FAILED, 'Failed')
    ]

    ORDER_STATUS_CHOICES = [
        ('P', 'Pending'),
        ('C','Completed'),
         ('CA','Cancelled')

    ]

    placed_at = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(
        max_length=1, choices=PAYMENT_STATUS_CHOICES, default=PAYMENT_STATUS_PENDING)
    student = models.ForeignKey(Student, on_delete=models.PROTECT)
    order_status = models.CharField(
        max_length=2, choices=ORDER_STATUS_CHOICES, default='P')


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE,related_name='items')
    course = models.ForeignKey(Course, on_delete=models.PROTECT)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    


'''class Address(models.Model):
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    customer = models.ForeignKey(
        Customer, on_delete=models.CASCADE)'''


class Cart(models.Model):
    id=models.UUIDField(primary_key=True,default=uuid4)
    created_at = models.DateTimeField(auto_now_add=True)
    student=models.OneToOneField(Student,on_delete=models.CASCADE,null=True)
    class Meta:
        unique_together=[['id','student']]


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE,related_name='items')
    course = models.ForeignKey(Course, on_delete=models.CASCADE,related_name='course_items')
    unit_price = models.DecimalField(max_digits=10, decimal_places=2,null=True)
    

    class Meta:
        unique_together=[['cart','course']]

    



class Reviews(models.Model):
    course=models.ForeignKey(Course,on_delete=models.CASCADE,related_name='reviews')
    name=models.CharField(max_length=255)
    description=models.TextField()
    date=models.DateField(auto_now_add=True)
    student=models.ForeignKey(Student,on_delete=models.CASCADE,null=True,related_name='reviews_customer')



class CourseTutorials(models.Model):
    title=models.CharField(max_length=255)
    video=models.FileField(upload_to='store/course/videos')
    course=models.ForeignKey(Course,on_delete=models.CASCADE)

class CourseDocuments(models.Model):
    title=models.CharField(max_length=255)
    pdf=models.FileField(upload_to='store/course/documents')
    course=models.ForeignKey(Course,on_delete=models.CASCADE)

