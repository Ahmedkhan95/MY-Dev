function getData() {
// https://sheets.googleapis.com/v4/spreadsheets/12UpXw7oVFlV3iqioBKtcfvjDLdA3kKCqptr5Z99YNe4/values/Sheet1?valueRenderOption=FORMATTED_VALUE&key=AIzaSyBbby1ARUgzzPgR1fPQcVL7as1aqgwM4JY
try {
      var dest = $.net.http.readDestination("ETL_New.services", "test");
    var client = new $.net.http.Client();
	var req = new $.web.WebRequest($.net.http.GET,"valueRenderOption=FORMATTED_VALUE&key=AIzaSyBbby1ARUgzzPgR1fPQcVL7as1aqgwM4JY");
	client.request(req, dest);
	var response = client.getResponse();
	var JString = response.body.asString();
    // 	var JString = JSON.stringify(response);
	var aString = JSON.parse(JString).values;
	if(aString.length !== 0)
	{
	    try{
	        var connection = $.db.getConnection();
	        var pstmt = connection.prepareStatement("Upsert \"SYSTEM\".\"ETL_New.services::Google_Sheet_Data.Data\" values(?,?,?,?) WITH PRIMARY KEY");
	        pstmt.setBatchSize(aString.length);
	for(var i=1;i<aString.length;i++){
        pstmt.setString(1,aString[i][0]);
        pstmt.setString(2,aString[i][1]);
        var str = aString[i][2];
        var price = str.replace(",", ".");
        pstmt.setString(3,price);
        pstmt.setString(4,aString[i][3]);
        pstmt.addBatch();
	}
	pstmt.executeBatch();
	pstmt.close();
	connection.commit();
	connection.close();
    // $.response.setBody("Data Uploaded Successfully");
	    }
	     catch (e) {  
        $.response.setBody(e.message);
    }  
    }  
}
    catch (e) {  
        $.response.setBody(e.message);
    }  
}