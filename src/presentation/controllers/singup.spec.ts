import { SingUpController } from './singup'
import { InvalidParamError, MissingParamError, ServerError } from '../errors'
import { EmailValidator } from '../protocols'

interface SutTypes {
  sut: SingUpController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SingUpController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
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
        password_confirmation: 'qualquer_password'
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
        password_confirmation: 'qualquer_password'
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
        password_confirmation: 'qualquer_password'
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
        password_confirmation: 'qualquer_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Deve retornar erro 400 caso não seja informado o password_confirmation ', () => {
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
    expect(httpResponse.body).toEqual(new MissingParamError('password_confirmation'))
  })

  test('Deve retornar erro 400 caso o email seja invalido ', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'qualquer_nome',
        email: 'qualquer_email@email.com',
        password: 'qualquer_password',
        password_confirmation: 'qualquer_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Validar se o email chamado no Validator foi o email correto', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'qualquer_nome',
        email: 'qualquer_email@email.com',
        password: 'qualquer_password',
        password_confirmation: 'qualquer_password'
      }
    }
    sut.handle(httpRequest)

    expect(isValidSpy).toBeCalledWith('qualquer_email@email.com')
  })

  test('Deve retornar erro 500 caso ocorra algum problema no Email Validator ', () => {
    class EmailValidatorStub implements EmailValidator {
      isValid(email: string): boolean {
        throw new Error()
      }
    }
    const emailValidatorStub = new EmailValidatorStub()
    const sut = new SingUpController(emailValidatorStub)
    const httpRequest = {
      body: {
        name: 'qualquer_nome',
        email: 'qualquer_email@email.com',
        password: 'qualquer_password',
        password_confirmation: 'qualquer_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
