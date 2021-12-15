import { InvalidParamError, MissingParamError, ServerError } from '../../errors'

import { SingUpController } from './singup'
import { EmailValidator, AddAccount, AddAccountModel, AccountModel } from './singup-protocols'

interface SutTypes {
  sut: SingUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccountStub = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'qualquer_name',
        email: 'qualquer_email@email.com',
        password: 'valid_password'
      }
      return fakeAccount
    }
  }
  return new AddAccountStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const addAccountStub = makeAddAccountStub()
  const sut = new SingUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  test('Deve retornar erro 200 caso estava tudo ok ', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'qualquer_nome',
        email: 'qualquer_email@email.com',
        password: 'qualquer_password',
        passwordConfirmation: 'qualquer_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
  })

  test('Deve retornar erro 400 caso não seja informado o nome ', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'qualquer_email@email.com',
        password: 'qualquer_password',
        passwordConfirmation: 'qualquer_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Deve retornar erro 400 caso não seja informado o email ', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'qualquer_nome',
        password: 'qualquer_password',
        passwordConfirmation: 'qualquer_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Deve retornar erro 400 caso não seja informado o password ', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'qualquer_nome',
        email: 'qualquer_email@email.com',
        passwordConfirmation: 'qualquer_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Deve retornar erro 400 caso não seja informado o passwordConfirmation ', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'qualquer_nome',
        email: 'qualquer_email@email.com',
        password: 'qualquer_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Deve retornar erro 400 caso o passwordConfirmation for falso', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'qualquer_nome',
        email: 'qualquer_email@email.com',
        password: 'qualquer_password',
        passwordConfirmation: 'invalid_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Deve retornar erro 400 caso o email seja invalido ', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'qualquer_nome',
        email: 'qualquer_email@email.com',
        password: 'qualquer_password',
        passwordConfirmation: 'qualquer_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Validar se o email chamado no Validator foi o email correto ', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'qualquer_nome',
        email: 'qualquer_email@email.com',
        password: 'qualquer_password',
        passwordConfirmation: 'qualquer_password'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('qualquer_email@email.com')
  })

  test('Deve retornar erro 500 caso ocorra algum problema no Email Validator ', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'qualquer_nome',
        email: 'qualquer_email@email.com',
        password: 'qualquer_password',
        passwordConfirmation: 'qualquer_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Deve retornar o AddAccount com os valores informados ', () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'qualquer_nome',
        email: 'qualquer_email@email.com',
        password: 'qualquer_password',
        passwordConfirmation: 'qualquer_password'
      }
    }
    sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'qualquer_nome',
      email: 'qualquer_email@email.com',
      password: 'qualquer_password'
    })
  })
})
