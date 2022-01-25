import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash(): Promise<String> {
    return await new Promise<String>((resolve) => resolve('hash'))
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  const sut = new BcryptAdapter(salt)
  return sut
}

describe('Bcrypt Adapter', () => {
  test('Garantir que o Bcrypt seja chamado com os valores corretos', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Garantir que o Bcrypt retorne o hash quando sucesso', async () => {
    const sut = makeSut()
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash')
  })

  // test('Garantir o bcrypt throws se erro', async () => {
  //   const sut = makeSut()
  //   jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
  //   const promise = await sut.encrypt('any_value')
  //   await expect(promise).rejects.toThrow()
  // })
})
