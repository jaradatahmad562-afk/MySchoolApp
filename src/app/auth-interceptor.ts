import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. بنجيب التوكن المخزن بالـ localStorage
  const token = localStorage.getItem('token');

  // 2. إذا التوكن موجود، بنعمل نسخة من الطلب وبنحط التوكن بالـ Headers تبعه
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // بنمرر الطلب المعدل اللي صار معه توكن للـ Back-end
    return next(clonedReq);
  }

  // إذا ما في توكن (زي صفحة الـ login)، بنمرر الطلب الأصلي زي ما هو
  return next(req);
};