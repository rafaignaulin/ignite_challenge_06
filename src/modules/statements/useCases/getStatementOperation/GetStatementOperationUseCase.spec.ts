import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let statementRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase ;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement Test", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementRepositoryInMemory)
  })
  
  it("should be able to get the statement operation", async () => {
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

    const operation1 = await statementRepositoryInMemory.create(deposit)
    const operation2 = await statementRepositoryInMemory.create(withdraw)

    const balance = await getStatementOperationUseCase.execute({user_id: user.id, statement_id: operation1.id})
    const balance2 = await getStatementOperationUseCase.execute({user_id: user.id, statement_id: operation2.id})
    expect(balance).toHaveProperty("id")
    expect(balance.type).toBe("deposit")
    expect(balance2).toHaveProperty("id")
    expect(balance2.type).toBe("withdraw")
  })
  
})