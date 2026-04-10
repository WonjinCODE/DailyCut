package com.dailycut.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ApiResponseDto<T> {
    private boolean success;
    private T data;
    private ErrorDetail error;

    @Getter
    @NoArgsConstructor
    public static class ErrorDetail {
        private int status;
        private String message;

        public ErrorDetail(int status, String message) {
            this.status = status;
            this.message = message;
        }
    }

    public ApiResponseDto(boolean success, T data, ErrorDetail error) {
        this.success = success;
        this.data = data;
        this.error = error;
    }

    public static <T> ApiResponseDto<T> success(T data) {
        return new ApiResponseDto<>(true, data, null);
    }

    public static <T> ApiResponseDto<T> error(int status, String message) {
        return new ApiResponseDto<>(false, null, new ErrorDetail(status, message));
    }
}
