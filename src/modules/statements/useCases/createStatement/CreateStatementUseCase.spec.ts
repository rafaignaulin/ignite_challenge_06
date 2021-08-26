import { AppError } from "@shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement Test", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementRepositoryInMemory)
  })
  
  it("should be able to add a deposit", async () => {
    const user = await usersRepositoryInMemory.create({email: "test@test.com", name: "John Doe", password: "123"})

    const deposit = {
      user_id: user.id,
      type: 'deposit' as OperationType,
      amount: 50,
      description: "This is a deposit"
    }
    const operation = await createStatementUseCase.execute(deposit)
    expect(operation).toHaveProperty("id")
  })


  it("should be able to add a withdraw", async () => {
    const user = await usersRepositoryInMemory.create({email: "test@test.com", name: "John Doe", password: "123"})

    const deposit = {
      user_id: user.id,
      type: 'deposit' as OperationType,
      amount: 500,
      description: "This is a deposit"
    }

    await createStatementUseCase.execute(deposit)

    const withdraw = {
      user_id: user.id,
      type: 'withdraw' as OperationType,
      amount: 45,
      description: "This is a withdraw"
    }
    const operation = await createStatementUseCase.execute(withdraw)
    expect(operation).toHaveProperty("id")
  })

  it("should not be able to add a withdraw without funds", async () => {
    const user = await usersRepositoryInMemory.create({email: "test@test.com", name: "John Doe", password: "123"})

    const withdraw = {
      user_id: user.id,
      type: 'withdraw' as OperationType,
      amount: 45,
      description: "This is a withdraw"
    }

    expect(async () => {await createStatementUseCase.execute(withdraw)}).rejects.toBeInstanceOf(AppError)

  })
  
})