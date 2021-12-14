import { serverError } from './../helpers/http-helper'
import { EmailValidator } from './../protocols/email-validator'
import { HttpResponse, HttpRequest } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'

export class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'password_confirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      if (!this.emailValidator.isValid(httpRequest.body.email)) {
        return badRequest(new InvalidParamError('email'))
      }
      return {
        statusCode: 200,
        body: {}
      }
    } catch (error) {
      return serverError()
    }
  }
}
