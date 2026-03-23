import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // Definimos la interfaz localmente para este decorador
    const request = ctx
      .switchToHttp()
      .getRequest<{ user: { userId: string; email: string } }>();
    return request.user;
  },
);
