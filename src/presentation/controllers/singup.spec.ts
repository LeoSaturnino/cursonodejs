import { SingUpController } from './singup'
import { MissingParamError } from '../errors/missing-param-error'

describe('SignUp Controller', () => {
  test('Deve retornar erro 400 caso não seja informado o nome ', () => {
    const sut = new SingUpController()
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
    const sut = new SingUpController()
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
    const sut = new SingUpController()
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
    const sut = new SingUpController()
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
})
