# Project: SupportHer  
![image](https://github.com/user-attachments/assets/97048f4f-5f69-4372-a5ad-d7b325436463)


## Description  
SupportHer is a women's support platform designed to provide a secure and accessible space for users to seek guidance, access resources, and participate in support sessions. The platform includes authentication, user management, and CRUD operations for managing user-related data.  

## Features of SupportHer  
- **User Authentication**: Secure login and registration using JWT.  
- **Resources Section**: A collection of helpful articles, tips, and guides.  
- **Dashboard**: A personalized space where users can view many categories of supporting resources.  
- **User Profile**: You can manage them on admin panel.  

## Minimum Requirements  

### **Front End** (Angular)  
1. Implement all necessary interfaces/classes for APIs from the back-end.  
2. Create all required services to fetch data from the API.  
3. Include at least **4 `(onclick)` events** that interact with the API.  
4. Implement a minimum of **4 `[(ngModel)]` bindings**.  
5. Apply basic CSS styling for a user-friendly UI.  
6. Configure a routing module for page navigation.  
7. Utilize Angular directives such as `ngFor` and `ngIf`.  
8. Implement **JWT-based authentication**, including:  
   - HTTP interceptors  
   - Login functionality  
   - Logout functionality  



### **Back End** (Django + Django REST Framework)  
1. Define **at least 4 models** in the database.  
2. Implement at least **one model manager** (optional).  
3. Establish **at least 2 ForeignKey relationships** between models.  
4. Use serializers to structure API responses:  
   - At least **2 serializers** using `serializer.Serializer`  
   - At least **2 serializers** using `serializer.ModelSerializer`  
5. Develop API views:  
   - At least **2 function-based views (FBV)** using DRF  
   - At least **2 class-based views (CBV)** using APIView  
6. Enable **token-based authentication**:  
   - Login endpoint  
   - Logout endpoint  
7. Implement **CRUD operations for at least one model**, ensuring authenticated users can create objects (e.g., tasks or support requests).  
8. Provide **Postman requests** for testing all implemented API methods.  

## Commands for launching: 
### Backend (Django):
```
   cd /WEB-Project/supporther
```
```
   python3 -m venv venv
```
```
   source venv/bin/activate
```
```
   pip3 install django djangorestframework djangorestframework-simplejwt django-cors-headers pillow
```
```
   python3 manage.py migrate
```
```
   python3 manage.py runserver
```

### Frontend (Angular):
```
   cd /WEB-Project/supporther/supporther-client
```
```
   npm install
```
```
   ng serve
```



