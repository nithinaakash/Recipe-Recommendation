from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'first_name', 'last_name', 'dob', 'gender', 'is_staff', 'created_at', 'updated_at']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('dob', 'gender')}),
    )
    # Add any other customizations you need

admin.site.register(CustomUser, CustomUserAdmin)
