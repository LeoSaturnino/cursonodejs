import { AddAccount } from './../../domain/usecases/add-account'
import { Controller, EmailValidator, HttpResponse, HttpRequest } from '../protocols'
import { InvalidParamError, MissingParamError } from '../errors'
import { serverError, badRequest } from './../helpers/http-helper'

export class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      const addAccount = this.addAccount.add({
        name,
        email,
        password
      })
      return {
        statusCode: 200,
        body: addAccount
      }
    } catch (error) {
      return serverError()
    }
  }
}
