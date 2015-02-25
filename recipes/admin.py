from django.contrib import admin
from .models import Recipe

class RecipeAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {'fields':['owner', 'visible']}),
        ('Origin', {'fields': ['name','restaurant','url']})
    ]

# needs to be underneath admin classes
admin.site.register(Recipe, RecipeAdmin)
