import { EmailValidatorAdapter } from './email-validator'

describe('Email Validator Adapter', () => {
  test('Deve retornar falso se o validator retorna falso', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid_email@email.com')
    expect(isValid).toBe(false)
  })
})
