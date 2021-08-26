import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let statementRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Balance Test", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementRepositoryInMemory, usersRepositoryInMemory)
  })
  
  it("should be able to get the balance", async () => {
    const user = await usersRepositoryInMemory.create({email: "test@test.com", name: "John Doe", password: "123"})

    const deposit = {
      user_id: user.id,
      type: 'deposit' as OperationType,
      amount: 975,
      description: "This is a deposit"
    }
    const withdraw = {
      user_id: user.id,
      type: 'withdraw' as OperationType,
      amount: 475,
      description: "This is a deposit"
    }

    await statementRepositoryInMemory.create(deposit)
    await statementRepositoryInMemory.create(withdraw)

    const balance = await getBalanceUseCase.execute({user_id: user.id})
    console.log(balance)
    expect(balance).toHaveProperty("balance")
  })
  
})