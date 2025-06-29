from django.template import Library

register = Library()


@register.filter
def startswith(text, starts):
    print(f"Checking if '{text}' starts with '{starts}'")
    return text.startswith(starts)
