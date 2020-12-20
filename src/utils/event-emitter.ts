/**
 * 组件内全局通信机制
 */
// 添加const关键字，否则第三方引用的时候会报错找不到模块
// https://stackoverflow.com/questions/62483612/typescript-module-not-found-cant-resolve
export enum GanttEvent {
  ResizeStart,
  Resize,
  ResizeEnd,
  DragStart,
  Drag,
  DragEnd,
  ChangeColUnit,
  ScrollToNode,
  ScrollTo,
  Focus,
  StartHover,
  EndHover,
}

/**
 * 从内存上讲应该不需要手动取消监听 handler。因为只要 EventEmitter 实例未被引用了，其下资源会自动被回收♻️
 */
export default class EventEmitter {
  Event = GanttEvent

  private handlersMap = {} as Record<GanttEvent, Function[]>

  private getHandlers(event: GanttEvent) {
    if (!this.handlersMap[event]) this.handlersMap[event] = []
    return this.handlersMap[event]
  }

  on(event: GanttEvent, handler: Function) {
    const handlers = this.getHandlers(event)
    handlers.push(handler)
    return () => {
      const i = handlers.indexOf(handler)
      if (i > -1) handlers.splice(i, 1)
    }
  }

  emit(event: GanttEvent, ...args: any) {
    const handlers = this.getHandlers(event)
    handlers.forEach((handler) => handler(...args))
  }
}
