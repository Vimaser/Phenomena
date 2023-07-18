const { Client } = require("pg");
const CONNECTION_STRING = ("postgres://localhost:5432/phenomena-dev");
const client = new Client(CONNECTION_STRING);
//const apiRouter = require('../api/index.js');

async function getOpenReports() {
  
  try {
    //await client.connect();  

    // Query the database for open reports
    const { rows: reports } = await client.query(`
      SELECT * FROM reports WHERE "isOpen" = $1
    `, [true]);

   
    // Retrieve comments for each report
    for (const report of reports) {
      const { rows: comments } = await client.query(`
        SELECT * FROM comments WHERE "reportId" = $1
      `, [report.id]);

      // Update the report object
      report.comments = comments;
      delete report.password;
      report.isExpired = Date.parse(report.expirationDate) < new Date();
    }

    console.log(reports);
    // Return the resulting reports array
    return reports;
  } catch (error) {
    throw error;
  } 
}


async function createReport(reportFields) {
  const { title, location, description, password } = reportFields;

  try {
    const { rows: [report] } = await client.query(`
      INSERT INTO reports (title, location, description, password)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
    [title, location, description, password]
    );

    delete report.password;
    return report;
  } catch (error) {
    throw error;
  }
}

async function _getReport(reportId) {
  try {
    const query = `
      SELECT *
      FROM reports
      WHERE id = $1
    `;
    const values = [reportId];
    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      throw new Error('Report not found');
    }

    const report = result.rows[0];
    return report;
  } catch (error) {
    throw error;
  }
}

async function closeReport(reportId, password) {
  try {
    const getReportQuery = `
      SELECT id, "isOpen", password
      FROM reports
      WHERE id = $1
    `;
    const getReportValues = [reportId];
    const getReportResult = await client.query(getReportQuery, getReportValues);

    if (getReportResult.rows.length === 0) {
      throw new Error('Report does not exist with that id');
    }

    const report = getReportResult.rows[0];
    const { isOpen, password: reportPassword } = report;

    if (password !== reportPassword) {
      throw new Error('Password incorrect for this report, please try again');
    }

    if (!isOpen) {
      throw new Error('This report has already been closed');
    }

    const updateReportQuery = `
      UPDATE reports
      SET "isOpen" = false
      WHERE id = $1
    `;
    const updateReportValues = [reportId];
    await client.query(updateReportQuery, updateReportValues);

    return {"message": "Report successfully closed!"};
  } catch (error) {
    throw error;
  }
}

/* async function createReportComment(reportId, commentFields) {
  const { content } = commentFields;

  try {
    
    
    const getReportQuery = `
      SELECT id, "isOpen", "expirationDate"
      FROM reports
      WHERE id = $1 ;
    `;
    
    const getReportValues = reportId;
    const getReportResult = await client.query(getReportQuery, getReportValues);

    if (getReportResult.rows.length === 0) {
      throw new Error('That report does not exist, no comment has been made');
    }

    const report = getReportResult.rows[0];
    const { isOpen, expirationDate } = report;

    if (!isOpen) {
      throw new Error('That report has been closed, no comment has been made');
    }

    if (Date.parse(expirationDate) < new Date()) {
      throw new Error('The discussion time on this report has expired, no comment has been made');
    }

    const insertCommentQuery = (`
      INSERT INTO comments ("reportId", content)
      VALUES ($1, $2)
      RETURNING * ;
    `, [reportId, content]);

    const insertCommentValues = [reportId, content];
    const insertCommentResult = await client.query(insertCommentQuery, insertCommentValues);

    const comment = insertCommentResult.rows[0];

    const updateExpirationQuery = (`
      UPDATE reports
      SET "expirationDate" = CURRENT_TIMESTAMP + interval '1 day'
      WHERE id = $1 ;
    `, [reportId]);

    const updateExpirationValues = [reportId];
    await client.query(updateExpirationQuery, updateExpirationValues);


    return comment;
  } catch (error) {
    throw error;
  }
} */

async function createReportComment(reportId, commentFields) {
  // read off the content from the commentFields
  const { content } = commentFields;
  try {
    // grab the report we are going to be commenting on
    const report = await _getReport(reportId);
    // if it wasn't found, throw an error saying so
    if (!report) {
      throw new Error("That report does not exist, no comment has been made");
    }
    // if it is not open, throw an error saying so
    if (!report.isOpen) {
      throw new Error("That report has been closed, no comment has been made");
    }
    // if the current date is past the expiration, throw an error saying so
    // you can use Date.parse(report.expirationDate) < new Date() to check
    // all go: insert a comment
    const currentDate = new Date();
    if (Date.parse(report.expirationDate) < currentDate) {
      throw new Error(
        "The discussion time on this report has expired, no comment has been made"
      );
    }
    const {
      rows: [comment],
    } = await client.query(
      `
      INSERT INTO comments("reportId", content)
      VALUES ($1, $2)
      RETURNING *;
    `,
      [reportId, content]
    );
    // then update the expiration date to a day from now
    await client.query(
      `
      UPDATE reports
      SET "expirationDate" = CURRENT_TIMESTAMP + interval '1 day'
      WHERE id = $1;
    `,
      [reportId]
    );
    // finally, return the comment
    return comment;
  } catch (error) {
    throw error;
  }
}

/* const {
  getOpenReports,
  createReport,
  closeReport,
  createReportComment,
} = require('./reportFunctions'); */


module.exports = {
  client,
  getOpenReports,
  createReport,
  closeReport,
  _getReport,
  createReportComment
}
// process.env.DATABASE_URL || ("postgres://localhost:5432/phenomena-dev");

// Create a constant, CONNECTION_STRING, from either process.env.DATABASE_URL or postgres://localhost:5432/phenomena-dev

// Create the client using new Client(CONNECTION_STRING)
// Do not connect to the client in Íthis file!

/**
 * Report Related Methods
 */

/**
 * You should select all reports which are open. 
 *  
 * Additionally you should fetch all comments for these
 * reports, and add them to the report objects with a new field, comments.
 * 
 * Lastly, remove the password field from every report before returning them all.
 */



    // then, build two new properties on each report:
    // .comments for the comments which go with it
    //    it should be an array, even if there are none
    // .isExpired if the expiration date is before now
    //    you can use Date.parse(report.expirationDate) < new Date()
    // also, remove the password from all reports

    // finally, return the reports

/**
 * You should use the reportFields parameter (which is
 * an object with properties: title, location, description, password)
 * to insert a new row into the reports table.
 * 
 * On success, you should return the new report object,
 * and on failure you should throw the error up the stack.
 * 
 * Make sure to remove the password from the report object
 * before returning it.
 */


/**
 * NOTE: This function is not for use in other files, so we use an _ to
 * remind us that it is only to be used internally.
 * (for our testing purposes, though, we WILL export it)
 * 
 * It is used in both closeReport and createReportComment, below.
 * 
 * This function should take a reportId, select the report whose 
 * id matches that report id, and return it. 
 * 
 * This should return the password since it will not eventually
 * be returned by the API, but instead used to make choices in other
 * functions.
 *
 * 
/**
 * You should update the report where the reportId 
 * and password match, setting isOpen to false.
 * 
 * If the report is updated this way, return an object
 * with a message of "Success".
 * 
 * If nothing is updated this way, throw an error
 */

/**
 * Comment Related Methods
 */

/**
 * If the report is not found, or is closed or expired, throw an error
 * 
 * Otherwise, create a new comment with the correct
 * reportId, and update the expirationDate of the original
 * report to CURRENT_TIMESTAMP + interval '1 day' 
 */
