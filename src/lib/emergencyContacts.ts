export type EmergencyContact = {
  name: string;
  role?: string;
  phone?: string;
};

export type SupportContact = {
  name: string;
  workPhone?: string;
  mobile?: string;
};

export const emergencyContactGroups = [
  {
    title: "Emergency Contacts",
    contacts: [
      { name: "คุณเพชรนภา ทองทับทิม", role: "ผู้จัดการสาขา", phone: "081-170-5394" },
      { name: "คุณทศพร สุวรรณภาค", role: "ผู้จัดการฝ่าย Fresh Food", phone: "083-704-2466" },
      { name: "คุณพิมพ์ชนก วาทิน", role: "ผู้จัดการฝ่าย Commercial OMT.", phone: "097-1120-781" },
      { name: "คุณอังคณา โพธิ์สุวรรณ", role: "ผู้จัดการฝ่าย Operations", phone: "086-592-2936" },
      { name: "Donjai", role: "Mgr.", phone: "ไม่ระบุ" },
      { name: "คุณประศักดิ์ โถนสูงเนิน", role: "Chief Perishable", phone: "086-8995491" },
      { name: "คุณเกียรติชัย จินตรักษ์", role: "Chief Produce", phone: "095-5752248" },
      { name: "คุณณัฐพล สาเพิ่มทรัพย์", role: "Chief Butchery&Seafood", phone: "096-9120763" },
      { name: "คุณนฤมล อินทสันต์", role: "Chief Bakery&Delica", phone: "094-6714884" },
      { name: "คุณชนกานต์ ในวาส", role: "Chief DF", phone: "087-7579750" },
      { name: "คุณประภากร เกษม", role: "Chief DF", phone: "085-2266828" },
      { name: "คุณเอกชัย ลายสาคร", role: "Chief NF", phone: "099-3809301" },
      { name: "คุณรัฐวุฒิชัย นาสุวรรณ", role: "Chief NF", phone: "094-7636948" },
      { name: "คุณเยาวลักษณ์ เทพทองอินทร์", role: "Chief OSX", phone: "089-4795094" },
      { name: "Chief CE", phone: "ไม่ระบุ" },
      { name: "คุณปวีณา องอาจ", role: "Senior Staff Inventory", phone: "082-4590158" },
      { name: "คุณเดชา บัวอ่อง", role: "Chief MTN", phone: "084-2728803" },
      { name: "คุณวิไลพร โพธิ์ศรีสม", role: "Chief HR", phone: "093-7674331" },
      { name: "คุณนรเนตร มักน้อย", role: "Chief LP", phone: "082-9518366" },
      { name: "คุณอริสา แรงโสม", role: "Chief TWC", phone: "098-5454288" },
      { name: "คุณกรรณิการ์ พรมชาติ", role: "Store controller", phone: "062-3813038" },
    ] satisfies EmergencyContact[],
  },
  {
    title: "เบอร์โทรติดต่อ LP",
    contacts: [
      { name: "คุณนรเนตร มักน้อย", role: "Chief LP", phone: "082-9518366" },
      { name: "คุณชินวัฒน์ บุตรสมัน", role: "Staff", phone: "080-1342795" },
      // { name: "คุณพลพล นามวงศ์ลือ", role: "Staff", phone: "091-0525265" },
      { name: "คุณกัลยวรรณน์ มนัสการ", role: "Staff", phone: "090-5392287" },
      { name: "คุณวิชระ นุชเจริญ", role: "Staff", phone: "090-9736868" },
      { name: "คุณธานินทร์ ศรีทานันท์", role: "Staff", phone: "096-7472337" },
      { name: "คุณภูริชญ์ บำรุงราษฎร์", role: "Staff", phone: "088-8696955" },
    ] satisfies EmergencyContact[],
  },
  {
    title: "เบอร์โทรติดต่อช่าง / MTN",
    contacts: [
      { name: "คุณเดชา บัวอ่อง", role: "Chief MTN", phone: "084-2728803" },
      { name: "คุณปฐวี สถาอุ่น", role: "Staff", phone: "064-0924929" },
      { name: "คุณณัฐภูมิ ทองยศ", role: "Staff", phone: "084-3736455" },
      { name: "คุณชนากร ปภังเมืองกร", role: "Staff", phone: "061-2598989" },
    ] satisfies EmergencyContact[],
  },
  {
    title: "เบอร์โทรติดต่อฝ่ายบริหาร / AREA",
    contacts: [
      { name: "คุณพรรณารักษ์ ทีงาม", role: "AVP LP", phone: "081-300-3305" },
      { name: "คุณวิทยา ตันเต็ง", role: "Senior Manager Safety HO.", phone: "081-867-3240" },
      { name: "คุณวิเชียร นะสูงเนิน", role: "(SVP, VP) Big Format Operation", phone: "099-2877261" },
      { name: "คุณอังคาร อ่อนคำ", role: "AREA LP", phone: "094-4800390" },
      { name: "คุณสุโชคิ เหมธานินทร์", role: "AREA HR.", phone: "083-685-7556" },
      { name: "คุณกานต์ ไชยแสงศรี", role: "AREA MTN.", phone: "065-928-3376" },
    ] satisfies EmergencyContact[],
  },
] satisfies { title: string; contacts: EmergencyContact[] }[];

export const roomContacts = [
  { name: "ห้อง CCTV", phone: "02-421-999 #2111" },
  { name: "ห้องช่าง", phone: "02-421-999 #2125" },
] satisfies EmergencyContact[];

export const localSupportContacts = [
  { name: "ดับเพลิงบางแค และกู้ภัยบางแค", workPhone: "02-413-1149" },
  { name: "สถานีดับเพลิงหนองแขม", workPhone: "02-444-4644" },
  { name: "บรรเทาสาธารณภัย", workPhone: "199" },
  { name: "สำนักงานเขตบางแค", workPhone: "02-867-1635" },
  { name: "โรงพยาบาลเกษมราษฎร์ บางแค", workPhone: "02-455-0110 / 02-454-0033" },
  { name: "โรงพยาบาลวิชัยเวช อินเตอร์เนชั่นแนล หนองแขม", workPhone: "02-441-6999" },
  { name: "โรงพยาบาลบางไผ่", workPhone: "02-457-9740" },
  { name: "สถานีตำรวจนครบาล เพชรเกษม", workPhone: "02-455-1718 / 02-455-1719" },
  { name: "สถานีตำรวจนครบาล หลักสอง", workPhone: "02-421-7925 / 02-421-7927" },
  { name: "การไฟฟ้าบางขุนเทียน", workPhone: "02-841-5200 ด่วน 1130" },
  { name: "การประปานครหลวง สาขาภาษีเจริญ", workPhone: "02-455-0055" },
  { name: "ฝ่ายบริหารศูนย์การค้า", mobile: "091-818-4199" },
] satisfies SupportContact[];