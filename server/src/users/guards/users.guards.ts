import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class UpdateUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const currentUser = request.user; // User hiện tại (đã được giải mã từ JWT)
    const updateUserDto = request.body; // Dữ liệu update từ request
    if (!currentUser) {
      throw new ForbiddenException('Bạn chưa đăng nhập');
    }

    // Kiểm tra `_id` hợp lệ
    if (
      !updateUserDto._id ||
      !mongoose.Types.ObjectId.isValid(updateUserDto._id)
    ) {
      throw new BadRequestException('User ID không hợp lệ');
    }

    // Chặn user thường và HR cập nhật thông tin của user khác
    if (currentUser.role !== 'ADMIN' && currentUser._id !== updateUserDto._id) {
      throw new ForbiddenException('Bạn không có quyền cập nhật thông tin này');
    }

    // Nếu request có trường role, kiểm tra điều kiện cập nhật
    if (updateUserDto.role) {
      if (currentUser.role === 'USER' && updateUserDto.role !== 'USER') {
        throw new ForbiddenException('User không thể thay đổi role của mình');
      }

      if (currentUser.role === 'HR' && updateUserDto.role !== 'HR') {
        throw new ForbiddenException('HR không thể thay đổi role của mình');
      }

      // ADMIN có toàn quyền thay đổi role
    }

    return true; // Nếu không có lỗi, cho phép tiếp tục
  }
}

export class DeleteUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const currentUser = request.user; // User hiện tại (đã được giải mã từ JWT)
    const id = request.params.id; // ID user cần xoá
    if (!currentUser) {
      throw new ForbiddenException('Bạn chưa đăng nhập');
    }

    // Kiểm tra `_id` hợp lệ
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('User ID không hợp lệ');
    }

    // Kiểm tra chỉ cho phép ADMIN thực hiện xoá user
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền xoá user này');
    }

    return true; // Nếu không có lỗi, cho phép tiếp tục
  }
}

export class CheckAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const currentUser = request.user; // User hiện tại (đã được giải mã từ JWT)
    if (!currentUser) {
      throw new ForbiddenException('Bạn chưa đăng nhập');
    }

    // Kiểm tra chỉ cho phép ADMIN thực hiện xoá user
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Bạn không có quyền thực hiện hành động này!',
      );
    }

    return true; // Nếu không có lỗi, cho phép tiếp tục
  }
}
