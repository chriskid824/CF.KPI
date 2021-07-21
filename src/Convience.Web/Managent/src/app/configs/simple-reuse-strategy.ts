import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

// 简單路由复用策略，离開页面後保持页面状态
export class SimpleReuseStrategy implements RouteReuseStrategy {
    handlers: { [key: string]: DetachedRouteHandle } = {};

    // 离開当前页面的时候调用的方法,如果返回true,则會store方法會传入routehandle，否则為null。
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return route.data.isReuse || false;
    }

    // 保存RouteHandle
    store(route: ActivatedRouteSnapshot, handle: {}): void {
        this.handlers[route.routeConfig.path] = handle;
    }

    // 是否恢复之前store的路由,如果返回true的話,retrieve方法會被调用。
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return !!this.handlers[route.routeConfig.path];
    }

    // 返回存储的RouteHandle
    retrieve(route: ActivatedRouteSnapshot): any {
        return this.handlers[route.routeConfig.path];
    }

    // 判断当前路由和前一個路由是否相同
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig && JSON.stringify(future.params) === JSON.stringify(curr.params);
    }
}

// 使用方式
// app module 配置provider
// { provide: RouteReuseStrategy, useClass: SimpleReuseStrategy }
// 路由中
// { path: 'p1', component: Page1Component, data: { isReuse: false } }
