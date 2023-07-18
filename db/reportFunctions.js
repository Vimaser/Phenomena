/* const { client } = require("./index");

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
  
/*   async function _getReport(reportId) {
    try {
      const query = `
        SELECT id, title, location, description, password
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
  } */
  
/*   async function closeReport(reportId, password) {
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
  
  
  async function createReportComment(reportId, commentFields) {
    const { content } = commentFields;
  
    try {
      
      
      const getReportQuery = `
        SELECT id, "isOpen", "expirationDate"
        FROM reports
        WHERE id = $1
      `;
      
      const getReportValues = [reportId];
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
  
      const insertCommentQuery = `
        INSERT INTO comments ("reportId", "content")
        VALUES ($1, $2)
        RETURNING id, "reportId", "content"
      `;
  
      const insertCommentValues = [reportId, content];
      const insertCommentResult = await client.query(insertCommentQuery, insertCommentValues);
  
      const comment = insertCommentResult.rows[0];
  
      const updateExpirationQuery = `
        UPDATE reports
        SET "expirationDate" = CURRENT_TIMESTAMP + interval '1 day'
        WHERE id = $1
      `;
  
      const updateExpirationValues = [reportId];
      await client.query(updateExpirationQuery, updateExpirationValues);
  
  
      return comment;
    } catch (error) {
      throw error;
    }
  }
  
  module.exports = {
    getOpenReports,
    createReport,
    closeReport,
    createReportComment,
  };  */