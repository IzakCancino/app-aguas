const HEADER_API_KEY = { 'X-Api-Key': API_KEYS.AGUAS };

// Declare environment
const LOCAL_SERVER = 'https://localhost:44328/api';
const PUBLIC_SERVER = 'https://aguasss.bsite.net/api';

const ENV = PUBLIC_SERVER;

// Users
const GET_USER = ENV + '/Users/Read'
const CREATE_USER = ENV + '/Users/Create';
const LOGIN = ENV + '/Users/Login';
const CONFIRM_CREDENTIALS = ENV + '/Users/ConfirmCredentials';
const GET_HISTORIAL = ENV + '/Users/Historial';

// Reports
const GET_REPORTS = ENV + '/Reports/Read';
const CREATE_REPORT = ENV + '/Reports/Create';
const UPDATE_REPORT = ENV + '/Reports/Update';
const DELETE_REPORT = ENV + '/Reports/Delete';

// Report types
const GET_REPORT_TYPES = ENV + '/ReportTypes/Read';

// Organizations
const GET_ORGANIZATIONS = ENV + '/Organizations/Read';