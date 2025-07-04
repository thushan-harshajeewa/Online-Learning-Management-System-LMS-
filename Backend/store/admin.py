from . import models
from django.contrib import admin
from django.db.models.aggregates import Count
from django.utils.html import format_html, urlencode
from django.urls import reverse

'''from django.contrib import admin, messages
from django.db.models.aggregates import Count
from django.db.models.query import QuerySet
from django.utils.html import format_html, urlencode
from django.urls import reverse
from . import models


class InventoryFilter(admin.SimpleListFilter):
    title = 'inventory'
    parameter_name = 'inventory'

    def lookups(self, request, model_admin):
        return [
            ('<10', 'Low')
        ]

    def queryset(self, request, queryset: QuerySet):
        if self.value() == '<10':
            return queryset.filter(inventory__lt=10)
        
class ProductImageInline(admin.TabularInline):
    model=models.ProductImage 
    readonly_fields=['thumbnail']
    def thumbnail(self,instance):
        if instance.image.name !='':
            return format_html(f'<img src="{instance.image.url}" class="thumbnail" />')
        return ''       


@admin.register(models.Product)
class CourseAdmin(admin.ModelAdmin):
    autocomplete_fields = ['collection']
    prepopulated_fields = {
        'slug': ['title']
    }
    

    #inlines=[ProductImageInline]
    list_display = ['title', 'unit_price', 'collection_title']
    list_editable = ['unit_price']
    list_filter = ['collection', 'last_update']
    list_per_page = 10
    list_select_related = ['collection']
    search_fields = ['title']

    def collection_title(self, course):
        return course.collection.title



    
    #class Media:
        #css={
            #'all':['store/style.css']
        #}





@admin.register(models.Collection)
class CollectionAdmin(admin.ModelAdmin):
    
    list_display = ['title', 'course_count']
    search_fields = ['title']

    @admin.display(ordering='course_count')
    def course_count(self, collection):
        url = (
            reverse('admin:store_product_changelist')
            + '?'
            + urlencode({
                'collection__id': str(collection.id)
            }))
        return format_html('<a href="{}">{} course</a>', url, collection.course_count)

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(
            course_count=Count('course')
        )


@admin.register(models.Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name',  'membership', 'orders']
    list_editable = ['membership']
    list_per_page = 10
    list_select_related=['user']
    ordering = ['user__first_name', 'user__last_name']
    search_fields = ['first_name__istartswith', 'last_name__istartswith']

    @admin.display(ordering='orders_count')
    def orders(self, customer):
        url = (
            reverse('admin:store_order_changelist')
            + '?'
            + urlencode({
                'customer__id': str(customer.id)
            }))
        return format_html('<a href="{}">{} Orders</a>', url, customer.orders_count)

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(
            orders_count=Count('order')
        )


class OrderItemInline(admin.TabularInline):
    autocomplete_fields = ['product']
    min_num = 1
    max_num = 10
    model = models.OrderItem
    extra = 0


@admin.register(models.Order)
class OrderAdmin(admin.ModelAdmin):
    autocomplete_fields = ['student']
    inlines = [OrderItemInline]
    list_display = ['id', 'placed_at', 'student','order_status']
    list_editable=['order_status']'''


@admin.register(models.Course)
class CourseAdmin(admin.ModelAdmin):
    autocomplete_fields = ['collection']
    prepopulated_fields = {
        'slug': ['title']
    }
    

    #inlines=[ProductImageInline]
    list_display = ['title', 'unit_price', 'collection_title']
    list_editable = ['unit_price']
    list_filter = ['collection', 'last_update']
    list_per_page = 10
    list_select_related = ['collection']
    search_fields = ['title']

    def collection_title(self, course):
        return course.collection.title
    


@admin.register(models.Collection)
class CollectionAdmin(admin.ModelAdmin):
    
    list_display = ['title']
    search_fields = ['title']



    def get_queryset(self, request):
        return super().get_queryset(request).annotate(
            courses_count=Count('courses')
        )

@admin.register(models.Order)
class OrderAdmin(admin.ModelAdmin):
    #autocomplete_fields = ['student']
    #inlines = [OrderItemInline]
    list_display = ['id', 'placed_at', 'student','order_status']
    list_editable=['order_status']

    
    #class Media:
        #css={
            #'all':['store/style.css']
        #}