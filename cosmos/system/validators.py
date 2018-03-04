from django.core.validators import RegexValidator

legal_chars = RegexValidator(
    r'^[0-9a-zA-Z \.-]*$',
    'Only alphanumeric characters, hyphens, periods, and spaces are allowed'
)
