/**
 * Copyright © 2018 Seth Livingston.
 * License: MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
/** Set to true for development and testing only. */
const DEBUG = true;

/*******************************************************************************
 * TYPES AND INTERFACES
 ******************************************************************************/

enum AuthType {
  None = "NONE",
  OAuth2 = "OAUTH2",
  Key = "KEY",
  UserPassword = "USER_PASS"
}

interface GetAuthTypeResponse {
  type: AuthType;
}

interface GetConfigRequest {
  languageCode: string;
}

enum ConfigParamType {
  TextInput = "TEXTINPUT",
  TextArea = "TEXTAREA",
  SelectSingle = "SELECTSINGLE",
  SelectMultiple = "SELECTMULTIPLE",
  Checkbox = "CHECKBOX",
  Info = "INFO"
}

interface ConfigParamControl {
  allowOverride: boolean;
}

interface ConfigParamOption {
  label: string;
  value: string;
}

interface ConfigParam {
  type: ConfigParamType;
  name: string;
  displayName?: string;
  helpText?: string;
  placeholder?: string;
  text?: string;
  parameterControl?: ConfigParamControl;
  options?: ConfigParamOption[];
}

interface GetConfigResponse {
  configParams: ConfigParam[];
  dateRangeRequired?: boolean;
}

enum SchemaFieldDataType {
  String = "STRING",
  Number = "NUMBER",
  Boolean = "BOOLEAN"
}

enum SchemaFieldAggregationType {
  Average = "AVG",
  Count = "COUNT",
  CountDistinct = "COUNT_DISTINCT",
  Max = "MAX",
  Min = "MIN",
  Sum = "SUM"
}

enum SchemaFieldConceptType {
  Dimension = "DIMENSION",
  Metric = "METRIC"
}

enum SchemaFieldSemanticType {
  Year = "YEAR",
  YearQuarter = "YEAR_QUARTER",
  YearMonth = "YEAR_MONTH",
  YearWeek = "YEAR_WEEK",
  YearMonthDay = "YEAR_MONTH_DAY",
  YearMonthDayHour = "YEAR_MONTH_DAY_HOUR",
  Quarter = "QUARTER",
  Month = "MONTH",
  Week = "WEEK",
  MonthDay = "MONTH_DAY",
  DayOfWeek = "DAY_OF_WEEK",
  Day = "DAY",
  Hour = "HOUR",
  Minute = "MINUTE",
  Duration = "DURATION",
  Country = "COUNTRY",
  CountryCode = "COUNTRY_CODE",
  Continent = "CONTINENT",
  ContinentCode = "CONTINENT_CODE",
  SubContinent = "SUB_CONTINENT",
  SubContinentCode = "SUB_CONTINENT_CODE",
  Region = "REGION",
  RegionCode = "REGION_CODE",
  City = "CITY",
  CityCode = "CITY_CODE",
  MetroCode = "METRO_CODE",
  LatitudeLongitude = "LATITUDE_LONGITUDE",
  Number = "NUMBER",
  Percent = "PERCENT",
  Text = "TEXT",
  Boolean = "BOOLEAN",
  Url = "URL",
  Image = "IMAGE"
}

interface SchemaFieldSemantics {
  conceptType: SchemaFieldConceptType;
  semanticType?: SchemaFieldSemanticType;
  semanticGroup?: string; // unused
  isReaggretable?: boolean;
}

interface SchemaField {
  name: string;
  label: string;
  dataType: SchemaFieldDataType;
  semantics: SchemaFieldSemantics;
  description?: string;
  group?: string;
  formula?: string;
  isDefault?: boolean;
  defaultAggregationType?: SchemaFieldAggregationType;
}

interface GetSchemaRequest {
  configParams: object;
  scriptParams: object;
}

interface GetSchemaResponse {
  schema: SchemaField[];
}

interface RequestedField {
  name: string;
}

interface DateRange {
  startDate: string;
  endDate: string;
}

interface ScriptParams {
  sampleExtraction?: boolean;
  lastRefresh?: string;
}

interface GetDataRequest {
  configParams: object;
  scriptParams: ScriptParams;
  dateRange: DateRange;
  fields: RequestedField[];
}

interface DataRow {
  values: any[];
}

interface GetDataResponse {
  schema: SchemaField[];
  rows: DataRow[];
  cachedData: boolean;
}

enum AuthPropertyName {
  ApiKey = "AUTH_API_KEY",
  Username = "AUTH_USERNAME",
  Password = "AUTH_PASSWORD"
}

enum AddonConfigProperty {
  SchemaURL = "SCHEMA_URL",
  DataURL = "DATA_URL"
}

/*******************************************************************************
 * AUTHORIZATION
 ******************************************************************************/

/**
 * Called by GDS to determine which information it needs to collect from the
 * user for authentication. The information it collects is sent to this
 * connector in a subsequent call to setCredentials().
 */
function getAuthType(): GetAuthTypeResponse {
  const authType = {
    type: AuthType.None
  };

  return authType;
}

/**
 * Called by GDS to ensure that the credentials collected from the user are
 * valid credentials.
 */
function isAuthValid(): boolean {
  return true;
}

/** Called by GDS to clear out any stored credentails. */
function resetAuth(): void {}

/*******************************************************************************
 * GOOGLE DATA STUDIO ENTRY POINTS
 ******************************************************************************/

/**
 * Called by GDS to determine if it should provide additional debugging
 * information in Data Studio.
 */
function isAdminUser(): boolean {
  return DEBUG;
}

/**
 * Called by GDS to determine if any additional data should be collected from
 * the user and passed to getData().
 *
 * See https://developers.google.com/datastudio/connector/reference#getconfig
 *
 * @param request.languageCode {string} user's language (en, it, ...)
 */
function getConfig(request: GetConfigRequest): GetConfigResponse {
  const config: GetConfigResponse = {
    configParams: [
      {
        type: ConfigParamType.TextInput,
        name: AddonConfigProperty.SchemaURL,
        displayName: "Schema URL",
        helpText:
          "Your externally hosted connector's implementation of getSchema()."
      },
      {
        type: ConfigParamType.TextInput,
        name: AddonConfigProperty.DataURL,
        displayName: "Data URL",
        helpText:
          "Your externally hosted connector's implementation of getData()."
      }
    ],
    dateRangeRequired: true // ensures dates sent to getData()
  };

  return config;
}

/**
 * Called by GDS to get the schema for the data returned by getData().
 *
 * See https://developers.google.com/datastudio/connector/reference#getschema
 *
 * @param request - contains config values provided by the user
 */
function getSchema(request: GetSchemaRequest): GetSchemaResponse {
  const rootUrl = request.configParams[AddonConfigProperty.SchemaURL];
  const data = fetchFromPassthroughURL(rootUrl, request);

  return data;
}

/**
 * Called by GDS to get data from the underlying API or datastore. Converts
 * the data returned by the source to the schema defined by getSchema().
 *
 * See https://developers.google.com/datastudio/connector/reference#getdata
 *
 * @param request - configuration parameters and more
 */
function getData(request: GetDataRequest): GetDataResponse {
  const rootUrl = request.configParams[AddonConfigProperty.DataURL];
  const data = fetchFromPassthroughURL(rootUrl, request);

  return data;
}

/**
 * Fetches data from the passthrough endpoint by sending a POST request
 * with the request parameter, JSON encoded, as the payload.
 *
 * @param url - passthrough endpoint
 * @param request - request containing configParams and scriptParams
 */
function fetchFromPassthroughURL(
  url: string,
  request: GetSchemaRequest | GetDataRequest
) {
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    contentType: "application/json",
    method: "post",
    payload: JSON.stringify(request)
  };
  const response = UrlFetchApp.fetch(url, options);
  const data = JSON.parse(response.getContentText());

  return data;
}
