
var path = require("path");
const conDB = require("../dataBase/connectToDB");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") }); // בדיקת טעינת המשתנים הסביבתיים

    // הכנסת נתונים התחלתיים לטבלת users
    async function initializeDB() {
        // הכנסת נתונים התחלתיים לטבלת users
        const insertUsers = `
        INSERT INTO users (user_id, user_name,user_userName, email,phone) VALUES
        (1, 'Leanne Graham','Bret', 'Sincere@april.biz',0556723732),
        (2, 'Ervin Howell',"Antonette", 'Shanna@melissa.tv',0526723732),
        (3, 'Clementine Bauch', "Samantha",'Nathan@yesenia.net',,0550023732),
        (4, 'Patricia Lebsack',"Karianne", 'Julianne.OConner@kory.org',0556723799),
        (5, 'Chelsey Dietrich',"Kamren", 'Lucio_Hettinger@annie.ca',0554386546)
        `;
 
    await conDB.promise().query(insertUsers);
    // console.log("Initial users inserted"); 
    const insertPasswords = `
    INSERT INTO passwords (user_id,password ) VALUES
    (1, 'hildegard.org'),
    (2, 'anastasia.net'),
    (3,'Nathan@yesenia.net' ),
    (4, 'Patricia Lebsack'),
    (5, 'Chelsey Dietrich')
    `;
    await conDB.promise().query(insertPasswords);

    const insertDaily_segments = `
    INSERT INTO daily_segments  (daily_segments_id,segment_date,url_link, title) VALUES


    `;
    await conDB.promise().query(insertDaily_segments);


    const insertMinyans= `
    INSERT INTO minyans  (minyan_id,time_and_date  ,longitude,latitude,opener_phone, is_daily) VALUES
   
    `;
    await conDB.promise().query(insertMinyans);



    const insertNotes = `
    INSERT INTO notes  (note_id,user_id, body) VALUES
    (1,  1,"et iusto sed quo iure\nvoluptatem ")
     `;
    await conDB.promise().query(insertNotes);


    const insertSaved_daily_segments= `
    INSERT INTO saved_daily_segments  (user_id,daily_segments_id) VALUES
    `;
    await conDB.promise().query(insertSaved_daily_segments);


  }
  
  initializeDB();
  module.exports = initializeDB;