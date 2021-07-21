import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'menuType'
})
export class MenuTypePipe implements PipeTransform {

  private _menuTypeMap: { [key: number]: string } = {
    0: '未知',
    1: '菜單',
    2: '按鈕',
    3: '鏈結'
  }

  transform(value: number, ...args: unknown[]): unknown {
    return this._menuTypeMap[value];
  }

}
