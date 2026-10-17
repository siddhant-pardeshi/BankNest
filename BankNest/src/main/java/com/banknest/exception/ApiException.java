package com.banknest.exception;

import org.springframework.http.HttpStatus;

/**
 * Business-rule exception carrying the HTTP status to return.
 * Handled centrally by {@link GlobalExceptionHandler}.
 */
public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(String message) {
        this(message, HttpStatus.BAD_REQUEST);
    }

    public ApiException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
