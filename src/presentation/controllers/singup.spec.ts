import { SingUpController } from './singup'

describe('SignUp Controller', () => {
  test('Deve retornar erro 400 caso não seja informado o nome ', () => {
    const sut = new SingUpController()
    const httpRequest = {
      body: {
        //   name: 'qualquer_nome',
        email: 'qualquer_email@email.com',
        password: 'qualquer_password',
        password_confirmation: 'qualquer_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param name'))
  })
})
