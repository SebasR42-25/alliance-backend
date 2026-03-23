import { Module, Global } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Global() // Lo hacemos global para usarlo en toda la app sin re-importar
@Module({
  providers: [NotificationsGateway],
  exports: [NotificationsGateway],
})
export class NotificationsModule {}
