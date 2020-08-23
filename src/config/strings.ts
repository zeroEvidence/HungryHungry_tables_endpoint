// Class containing the strings for the software.
export class Strings {
  public respondingWithAvailableTables: string;
  public serviceUnavailable: string;
  public respondingWithQRData: string;
  public connectedToDatabase: string;
  public connectedToDatabaseEnded: string;
  public authIncomingUsernamePassword: string;
  public unauthorizedAttempt: string;
  public unauthorized: string;
  public authorizedAccess: string;
  public incomingRequest: string;
  public usingCachedTables: string;
  public incomingTablesNotAnObject: string;
  public invalidKeyNameInTables: string;
  public invalidObjectInTables: string;
  public restifyListeningAt: string;
  public restifyClosed: string;

  constructor() {
    this.respondingWithAvailableTables = "Responding with available tables.";
    this.serviceUnavailable = "Service Unavailable.";
    this.respondingWithQRData =
      "Responding with QRData for tableID: :tableid:.";
    this.connectedToDatabase = "Connected to database at: :host:.";
    this.connectedToDatabaseEnded =
      "Connection to the database as ended gracefully.";
    this.authIncomingUsernamePassword =
      "Incoming username: :authUsername:, password: :authPassword:.";
    this.unauthorizedAttempt = "Unauthorized attempt from ip: :ip:.";
    this.authorizedAccess = "Authorized access from ip: :ip:.";
    this.unauthorized = "Unauthorized";
    this.incomingRequest = "Incoming request: :requestData:.";
    this.usingCachedTables = "Using cached tables data.";
    this.incomingTablesNotAnObject =
      "Incomming tables data is not an object, tables: :tables:";
    this.invalidKeyNameInTables =
      "Invalid key name within tables data: tables.:room:.tables";
    this.invalidObjectInTables =
      "Invalid table object within tables data: tables.:room:.tables.:tableKey:";
    this.restifyListeningAt = ":name: listening at :url:";
    this.restifyClosed = ":name: closed and stopped listening at :url:";
  }
}
