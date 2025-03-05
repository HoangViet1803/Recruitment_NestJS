import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class checkRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const currentUser = request.user; // User hiện tại (đã được giải mã từ JWT)
    if (!currentUser) {
      throw new ForbiddenException('Bạn chưa đăng nhập');
    }

    // Kiểm tra 'role hợp lệ
    if (currentUser.role === 'USER') {
      throw new ForbiddenException(
        'Bạn không có quyền thực hiện hành động này!',
      );
    }

    return true;
  }
}
