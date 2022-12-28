export class SystemConfig {
  private static _openAiKeyHeader: string = "sk-";
  private static _openAiKeyBody: string =
    "D5i9Dfi9cZOfIrkAIMoeT3BlbkFJixu2HASnqUigvQq";
  private static _openAiKeyFooter: string = "uxuyJ";
  public static get openAiKey(): string {
    return this._openAiKeyHeader + this._openAiKeyBody + this._openAiKeyFooter;
  }
}
