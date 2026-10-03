from rest_framework.pagination import PageNumberPagination


class SubmissionPagination(PageNumberPagination):
    page_size = 20
    # ?pageSize= arrives as page_size thanks to CamelCaseMiddleWare.
    page_size_query_param = "page_size"
    max_page_size = 100
