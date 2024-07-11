const Student = require("../models/StudentModel");
const Group = require("../models/groupModel");
const Center = require("../models/centerModel");

const addStudent = async (req, res) => {
  const { name, phone, parentPhone, grade, group, code, payment } = req.body;
  console.log(name, phone, parentPhone, grade, group, code, payment);
  console.log("Grade: ", grade);
  try {
    let studentMoney = 0;
    if (
      !name ||
      !phone ||
      !parentPhone ||
      !grade ||
      !group ||
      !code ||
      !payment
    ) {
      throw Error("All fields are required.");
    }
    if (phone == parentPhone) {
      throw Error("Phone and parent phone can not be the same");
    }
    if (phone.length !== 11 || parentPhone.length !== 11) {
      console.log("Phone numbers should have exactly 11 digits.");
      return res
        .status(422)
        .json({ error: "Phone numbers should have exactly 11 digits." });
    }
    console.log("passed 11 digits test");
    const digitsRegex = /^\d+$/;
    console.log("Is phone valid:", digitsRegex.test(phone));
    console.log("Is parent phone valid:", digitsRegex.test(parentPhone));
    if (!digitsRegex.test(phone) || !digitsRegex.test(parentPhone)) {
      console.log("Phone numbers should consist of digits only.");
      return res
        .status(422)
        .json({ error: "Phone numbers should consist of digits only." });
    }
    console.log("passed type of digits test");
    if (!phone.startsWith("01") || !parentPhone.startsWith("01")) {
      console.log("You can reserve with Egyptian Numbers only..");
      return res
        .status(422)
        .json({ error: "You can reserve with Egyptian Numbers only.." });
    }
    console.log("passed 01 digits test");

    const checkStudent = await Student.findOne({ code });
    if (checkStudent) {
      throw Error("Student already exists");
    } else {
      const findGroup = await Group.findOne({ name: group });
      if (!findGroup) {
        throw Error("Group does not exist");
      } else {
        if (findGroup.validSeats === 0) {
          throw Error("لا يوجد مقاعد متاحة في هذه المجموعة");
        } else {
          if(payment === "منحة"){
            studentMoney = 0;
          }
          else{
            studentMoney = findGroup.pricePerClass * (8 - findGroup.currentClass);
          }
          console.log("Student Money: ", studentMoney);
          const studentClass = {
            sort: findGroup.currentClass,
            month: findGroup.currentMonth,
            attendance: "حاضر",
          }
          console.log("Student Class: ", studentClass);
            const student = new Student({
            name,
            phone,
            parentPhone,
            grade,
            group: findGroup,
            code,
            payment,
            class: [studentClass],
            money: studentMoney,
            });
          console.log("Student: ", student);
          await student.save();
          console.log("Student added successfully..");
          findGroup.validSeats = findGroup.validSeats - 1;
          await findGroup.save();
          res.status(201).json(student);
        }
      }
    }
  } catch (error) {
    console.log("Can not add student");
    res.status(400).json({ error: error.message });
  }
};
const searchCode = async (req, res) => {
  const { query } = req.query;
  console.log("searched code is: ", query);
  try {
    const searchResults = await Student.find({ code: query }).populate("group");
    console.log("Search results:", searchResults);

    res.json({ message: "Search results:", results: searchResults });
  } catch (error) {
    console.error("Error in search query:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getStudent = async (req, res) => {
  const { grade, group } = req.body;
  console.log("search queries: ", grade, group);
  try {
    let query = { grade };
    if (group) {
      const groupExists = await Group.findOne({ name: group });
      if (groupExists) {
        query.group = groupExists._id;
      }
    }
    const students = await Student.find(query).populate("group");
    res.status(200).json(students);
  } catch (error) {
    console.error("Error in filtering students by grade and groups:", error);
    res
      .status(500)
      .json({ error: "Error in filtering students by grade and groups:" });
  }
};
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({}).populate("group");
    res.status(200).json(students);
  } catch (error) {
    console.error("Error in getting all students:", error);
    res.status(500).json({ error: "Error in getting all students:" });
  }

}

const deleteStudent = async (req, res) => {
  const { code } = req.params;
  console.log("Code to delete: ", code);
  try {
    const student = await Student.findOne({ code });
    if (!student) {
      throw Error("Student does not exist");
    } else {
      const group = await Group.findOne({ _id: student.group });
      group.validSeats = group.validSeats + 1;
      console.log("Group: ", group);
      await student.deleteOne({ code });
      await group.save();

      res.status(200).json({ message: "Student deleted successfully" });
    }
  } catch (error) {
    console.error("Error in deleting student:", error);
    res.status(500).json({ error: "Error in deleting student:" });
  }
};

const deleteAllStudents = async (req, res) => {
  try {
    await Student.deleteMany({});
    res.status(200).json({ message: "All students deleted successfully" });
  } catch (error) {
    console.error("Error in deleting all students:", error);
    res.status(500).json({ error: "Error in deleting all students:" });
  }
};

const editStudent = async (req, res) => {
  const { id } = req.params;
  console.log("Student ID: ", id);
  const { code, name, phone, parentPhone, grade, group, payment } = req.body;
  console.log(
    "Student data: ",
    code,
    name,
    phone,
    parentPhone,
    grade,
    group,
    payment
  );
  const checkStudent = await Student.findOne({ code });

  try {
    const student = await Student.findOne({ _id: id });
    const studentGroup = await Group.findOne({ _id: student.group });
    const wantedGroup = await Group.findOne({ name: group });
    if (!student) {
      throw Error("هذا الطالب غير مسجل");
    } else {
      if (studentGroup.name !== group && group) {
        if (wantedGroup.validSeats === 0) {
          throw Error("لا يمكن تسحيل الطالب بهذه المجموعة");
        } else {
          if (wantedGroup.grade !== student.grade) {
            studentGroup.validSeats = studentGroup.validSeats + 1;
            wantedGroup.validSeats = wantedGroup.validSeats - 1;
            student.grade = wantedGroup.grade;
            student.group = wantedGroup._id;
            await student.save();
            await studentGroup.save();
            await wantedGroup.save();
            console.log("student has been moved to another grade and group.");
            res.status(200).json({
              message: `تم تعديل بيانات الطالب ${student.name} بنجاح`,
            });
          } else {
            studentGroup.validSeats = studentGroup.validSeats + 1;
            wantedGroup.validSeats = wantedGroup.validSeats - 1;
            student.group = wantedGroup._id;
            await student.save();
            await studentGroup.save();
            await wantedGroup.save();
            console.log("student has been moved to another group.");
            res.status(200).json({
              message: `تم تعديل بيانات الطالب ${student.name} بنجاح`,
            });
          }
        }
      } else {
        if (checkStudent && checkStudent.code !== student.code) {
          throw Error("هذا الكود مسجل بالفعل");
        }
        code ? (student.code = code) : (student.code = student.code);
        name ? (student.name = name) : (student.name = student.name);
        phone ? (student.phone = phone) : (student.phone = student.phone);
        parentPhone
          ? (student.parentPhone = parentPhone)
          : (student.parentPhone = student.parentPhone);
        grade ? (student.grade = grade) : (student.grade = student.grade);
        group
          ? (student.group = studentGroup._id)
          : (student.group = student.group);

        if (payment !== undefined && payment !== null && payment !== "") {
          student.payment = payment;
        } else {
          student.payment = student.payment;
        }
        await student.save();
        console.log("Student has been edited successfully");
        res
          .status(200)
          .json({ message: `تم تعديل بيانات الطالب ${student.name} بنجاح` });
      }
    }
  } catch (error) {
    console.error("Error in editing student:", error);
    res
      .status(500)
      .json({ error: "خطأ في تسجيل البيانات", message: error.message });
  }
};

const payStudent = async (req, res) => {
  const { id } = req.params;
  const { paymentPrice} = req.body;
  console.log("Payment Price: ", paymentPrice);
  console.log("Student ID: ", id)
  try {
    const student = await Student.findById(id).populate("group");
    const center = await Center.findOne({ name: student.group.center });
    if (!student) {
      throw Error("Student not found");
    }
    if (paymentPrice === 0) {
      throw Error("يجب إدخال قيمة الدفع");
    }
    if (paymentPrice < 0) {
      throw Error("لا يمكن إدخال قيمة سالبة");
    }
    if (paymentPrice > student.group.pricePerMonth) {
      throw Error("القيمة المدخلة أكبر من مستحقات الشهر");
    }
    if(student.money < paymentPrice){
      throw Error("المبلغ المدخل أكبر مما يجب دفعه");
    }
    const group = await Group.findById(student.group._id);
    if(paymentPrice < group.pricePerClass){
        throw Error("القيمة المدخلة أقل من قيمة الحصة");
    }
  
    const centerMoneyPerClass = student.group.centerPricePerClass;
    let centerAmount = (centerMoneyPerClass / student.group.pricePerClass) * paymentPrice

    console.log("Center amount: ", centerAmount);

    const today = new Date().toISOString().slice(0, 10);

    const existingMoney = center.money.find((money) => money.date.toISOString().slice(0, 10) === today);
    
    if (existingMoney) {
      existingMoney.amount += centerAmount;
      existingMoney.paid += centerAmount;
      existingMoney.remaining -= centerAmount;
      console.log("Existing Money: ", existingMoney);
      const moneyDetails = existingMoney.moneyDetails.find((s) => s.studentCode === student.code);
      console.log("Existing Money Money Details: ", existingMoney.moneyDetails);
      if(moneyDetails){
        moneyDetails.totalPaid += centerAmount;
        moneyDetails.centerMoney += centerAmount;
        moneyDetails.date = today;
      }
      else{
        existingMoney.moneyDetails.push({
          studentCode: student.code,
          studentName: student.name,
          group: group.name,
          totalPaid: paymentPrice,
          centerMoney: centerAmount,
          date: today,
        });
      }
      
      // if (moneyDetails) {
      //   moneyDetails.total += centerAmount;
      //   moneyDetails.students.push({
      //     studentCode: student.code,
      //     studentName: student.name,
      //     group: group.name,
      //     totalPaid: paymentPrice,
      //     centerMoney: centerAmount,
      //     date: new Date().toISOString().slice(0, 10),
      //   });
      // }
      // else {
      //   existingMoney.moneyDetails.push({
      //       students: [{
      //         studentCode: student.code,
      //         studentName: student.name,
      //         group: group.name,
      //         totalPaid: paymentPrice,
      //         centerMoney: centerAmount,
      //         date: new Date().toISOString().slice(0, 10),
      //     }],
      //     total: centerAmount,
      //   });
      // }
    }
     else {
      center.money.push({
        date: new Date().toISOString().slice(0, 10),
        amount: student.group.centerPricePerClass * 8,
        paid: centerAmount,
        remaining: student.group.centerPricePerClass * 8 - centerAmount,
        moneyDetails:[{
                studentCode: student.code,
                studentName: student.name,
                group: group.name,
                totalPaid: centerAmount,
                centerMoney: student.group.centerPricePerClass * 8,
                date: new Date().toISOString().slice(0, 10),
              }],
      });
    }

    if (paymentPrice === student.group.pricePerMonth) {
      student.paymentStatus = "دفع"
    }

    center.remaining = 0;
    for (const money of center.money) {
      center.remaining += money.remaining;
    }

    console.log("student.money - paymentPrice = ", student.money - paymentPrice)
    student.money = student.money - paymentPrice;
    await center.save();
    await student.save();
    console.log("Student: ", student);
    console.log("Center: ", center);
    // console.log("Payment: ", payment);
    res.status(200).json({ message: "تم الدفع بنجاح" });
  }
  catch (error) {
    console.error("Error in paying:", error);
    res.status(500).json({ error: error.message });
  }
}

const startClass = async (req, res) =>{
  const { group } = req.body;
  try {
    const g = await Group.findOne({ name: group });
    console.log("Group Name: ", group);
    console.log("Found Group: ", g);
    let classIncrement = 0;
    if(g.type === "دابل"){
      classIncrement = 2;
    }
    else if(g.type === "عادي"){
      classIncrement = 1;
    }
    const id = g._id;
    const students = await Student.find({group: id});
    console.log("Students: ", students);
    if (!g) {
      throw Error("يجب تسجيل المجموعة");
    }
    let newClass = {
      sort: 0,
      month: 0,
    }
    
    let currentMonth = 1;
    let currentClass = 0;

    for (const student of students) {
      currentMonth = g.currentMonth;
      currentClass = g.currentClass;
      let newClassOrder = 0;

      if(g.currentClass === 1 && g.currentMonth === 1){
        console.log("First class and student money updated..");
        student.money = g.pricePerMonth;
      }

      const latestClass = student.class.find((cls) => cls.sort === currentClass && cls.month === currentMonth);
      console.log("Latest class: ", latestClass);
      if (latestClass) {
        newClassOrder = latestClass.sort;
        if (g.classActive) {
          console.log("Class is active");
          throw Error("الحصة الحالية لم تنتهي بعد");
        }
        if(latestClass.sort === 8){
          console.log("Class sort is 8");
          newClassOrder += classIncrement;
          currentMonth++;
          if(student.payment === "منحة"){
            student.money = 0;
          }
          else{
            student.money += g.pricePerMonth;
          }
        }
        else{
          console.log("Class sort is not 8");
          newClassOrder += classIncrement;
        }
      }

      if(newClassOrder === 0){
        console.log("New Class Order is 0");
        newClassOrder += classIncrement;
      }
      console.log("New Class Order: ", newClassOrder);
      newClass = {
        sort: newClassOrder,
        month: currentMonth,
      }


      student.class.push(newClass);

      await student.save();
    }
    
    if(g.currentClass === 8){
      g.currentClass += classIncrement;
      g.currentMonth += 1;
    }
    else{
      g.currentClass += classIncrement;
    }
    g.classActive = true;

    await g.save();
    console.log("New Class: ", newClass);

    res.status(200).json({ 
      class: newClass,
      group: g,
      message: 'Classes started successfully!' });
  }
  catch(error){
    console.error("Error in starting class:", error);
    res.status(500).json({error: error.message});
  }
}

const endClass = async (req, res) => {
  const { group } = req.body;
  try {
    const g = await Group.findOne({ name: group });
    console.log("Group Name: ", group);
    console.log("Found Group: ", g);
    if (!g) {
      throw Error("يجب تسجيل المجموعة");
    }
    const id = g._id
    console.log("Group id: ", id)
    console.log("g._id", g._id)
    const students = await Student.find({ group: id });
    console.log("Students: ", students);

    for (const student of students) {
      let currentMonth = g.currentMonth;
      let currentClass = g.currentClass;
      const latestClass = student.class.find(
        (cls) =>
          cls.sort === g.currentClass && cls.month === g.currentMonth
      );
      console.log("Latest class: ", latestClass);

      if (latestClass) {
        if (g.classActive) {
          let continuousAbsence = 0;

          for (let i = 0; i < student.class.length; i++) {
            if (student.class[i]?.attendance === "غائب") {
              student.absence = student.absence + 1;
              continuousAbsence++;
            }
            else if (student.class[i]?.attendance === "حاضر" && continuousAbsence < 3){
              continuousAbsence = 0;
            }
          }

          if (continuousAbsence >= 3) {
            student.status = "ملغي";
          }
          await student.save();
        } else {
          throw Error("هذه الحصة ليست نشطة حالياً");
        }
      } else {
        throw Error("يوجد خطأ في إنهاء الحصة");
      }
    }
    g.classActive = false;
    await g.save();
    res.status(200).json({ students, message: "Class ended successfully!" });
  } catch (error) {
    console.error("Error in ending class:", error);
    res.status(500).json({ error: error.message });
  }
};

const studentAttendance = async (req, res) => {
  const {code, group} = req.body
  try {
    console.log("Code: ", code);
    console.log("Group: ", group);
    const g = await Group.findOne({name: group})
    console.log("Attending Group: ", g);
    if(!g){
      throw Error("يجب تسجيل المجموعة")
    }
    const student = await Student.findOne({code}).populate("group");
    console.log("Attending Student: ", student);
    if(!student){
      throw Error("هذا الطالب غير مسجل");
    }
    const length = student.class.length
    console.log("Length: ", length)
    console.log("Student Current Class: ", student.class[length - 1].sort);
    const latestClass = student.class.find((cls) => cls.sort === g.currentClass && cls.month === g.currentMonth);
    console.log("Latest Class: ", latestClass);
    if(!g.classActive){
      throw Error("هذه الحصة ليست نشطة حالياً");
    }
    if(latestClass && latestClass.attendance === "حاضر"){
      throw Error("هذا الطالب حضر بالفعل");
    }
    if(latestClass){
      latestClass.attendance = "حاضر";
    }
    await student.save();
    res.status(200).json({
      student,
      message: "تم تسجيل حضور الطالب بنجاح"
    });
  } catch (error) {
    console.error("Error in student attendance:", error);
    res.status(500).json({ error: error.message });
  }
}


module.exports = {
  addStudent,
  getStudent,
  getAllStudents,
  searchCode,
  deleteAllStudents,
  deleteStudent,
  editStudent,
  payStudent,
  startClass,
  endClass,
  studentAttendance
};
