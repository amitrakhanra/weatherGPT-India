export interface StateEntry {
  name: string;
  slug: string;
}

export const STATES: [string, string][] = [
  ["Andaman and Nicobar Islands","andaman-and-nicobar-islands"],["Andhra Pradesh","andhra-pradesh"],
  ["Arunachal Pradesh","arunachal-pradesh"],["Assam","assam"],["Bihar","bihar"],["Chandigarh","chandigarh"],
  ["Chhattisgarh","chhattisgarh"],["Dadra and Nagar Haveli","dadra-and-nagar-haveli"],["Daman and Diu","daman-and-diu"],
  ["Goa","goa"],["Gujarat","gujarat"],["Haryana","haryana"],["Himachal Pradesh","himachal-pradesh"],
  ["Jammu and Kashmir","jammu-and-kashmir"],["Jharkhand","jharkhand"],["Karnataka","karnataka"],["Kerala","kerala"],
  ["Lakshadweep","lakshadweep"],["Madhya Pradesh","madhya-pradesh"],["Maharashtra","maharashtra"],["Manipur","manipur"],
  ["Meghalaya","meghalaya"],["Mizoram","mizoram"],["NCT of Delhi","nct-of-delhi"],["Nagaland","nagaland"],
  ["Odisha","odisha"],["Puducherry","puducherry"],["Punjab","punjab"],["Rajasthan","rajasthan"],["Sikkim","sikkim"],
  ["Tamil Nadu","tamil-nadu"],["Telangana","telangana"],["Tripura","tripura"],["Uttar Pradesh","uttar-pradesh"],
  ["Uttarakhand","uttarakhand"],["West Bengal","west-bengal"]
];

export const DISTRICTS: Record<string, string[]> = {
  "andaman-and-nicobar-islands": ["Nicobar","North and Middle Andaman","South Andaman"],
  "andhra-pradesh": ["Anantapur","Chittoor","East Godavari","Guntur","Krishna","Kurnool","Nellore","Prakasam","Srikakulam","Visakhapatnam","Vizianagaram","West Godavari","YSR Kadapa"],
  "arunachal-pradesh": ["Tawang","West Kameng","East Kameng","Papum Pare","Kurung Kumey","Kra Daadi","Lower Subansiri","Upper Subansiri","West Siang","East Siang","Siang","Upper Siang","Lower Siang","Lower Dibang Valley","Dibang Valley","Anjaw","Lohit","Namsai","Changlang","Tirap","Longding"],
  "assam": ["Baksa","Barpeta","Biswanath","Bongaigaon","Cachar","Charaideo","Chirang","Darrang","Dhemaji","Dhubri","Dibrugarh","Goalpara","Golaghat","Hailakandi","Hojai","Jorhat","Kamrup Metropolitan","Kamrup","Karbi Anglong","Karimganj","Kokrajhar","Lakhimpur","Majuli","Morigaon","Nagaon","Nalbari","Dima Hasao","Sivasagar","Sonitpur","South Salmara-Mankachar","Tinsukia","Udalguri","West Karbi Anglong"],
  "bihar": ["Araria","Arwal","Aurangabad","Banka","Begusarai","Bhagalpur","Bhojpur","Buxar","Darbhanga","East Champaran","Gaya","Gopalganj","Jamui","Jehanabad","Kaimur","Katihar","Khagaria","Kishanganj","Lakhisarai","Madhepura","Madhubani","Munger","Muzaffarpur","Nalanda","Nawada","Patna","Purnia","Rohtas","Saharsa","Samastipur","Saran","Sheikhpura","Sheohar","Sitamarhi","Siwan","Supaul","Vaishali","West Champaran"],
  "chandigarh": ["Chandigarh"],
  "chhattisgarh": ["Balod","Baloda Bazar","Balrampur","Bastar","Bemetara","Bijapur","Bilaspur","Dantewada","Dhamtari","Durg","Gariyaband","Janjgir-Champa","Jashpur","Kabirdham","Kanker","Kondagaon","Korba","Korea","Mahasamund","Mungeli","Narayanpur","Raigarh","Raipur","Rajnandgaon","Sukma","Surajpur","Surguja"],
  "dadra-and-nagar-haveli": ["Dadra and Nagar Haveli"],
  "daman-and-diu": ["Daman","Diu"],
  "goa": ["North Goa","South Goa"],
  "gujarat": ["Ahmedabad","Amreli","Anand","Aravalli","Banaskantha","Bharuch","Bhavnagar","Botad","Chhota Udepur","Dahod","Dangs","Devbhoomi Dwarka","Gandhinagar","Gir Somnath","Jamnagar","Junagadh","Kachchh","Kheda","Mahisagar","Mehsana","Morbi","Narmada","Navsari","Panchmahal","Patan","Porbandar","Rajkot","Sabarkantha","Surat","Surendranagar","Tapi","Vadodara","Valsad"],
  "haryana": ["Ambala","Bhiwani","Charkhi Dadri","Faridabad","Fatehabad","Gurugram","Hisar","Jhajjar","Jind","Kaithal","Karnal","Kurukshetra","Mahendragarh","Nuh","Palwal","Panchkula","Panipat","Rewari","Rohtak","Sirsa","Sonipat","Yamunanagar"],
  "himachal-pradesh": ["Bilaspur","Chamba","Hamirpur","Kangra","Kinnaur","Kullu","Lahaul and Spiti","Mandi","Shimla","Sirmaur","Solan","Una"],
  "jammu-and-kashmir": ["Anantnag","Bandipore","Baramulla","Budgam","Doda","Ganderbal","Jammu","Kathua","Kishtwar","Kulgam","Kupwara","Poonch","Pulwama","Rajouri","Ramban","Reasi","Samba","Shopian","Srinagar","Udhampur"],
  "jharkhand": ["Bokaro","Chatra","Deoghar","Dhanbad","Dumka","East Singhbhum","Garhwa","Giridih","Godda","Gumla","Hazaribagh","Jamtara","Khunti","Koderma","Latehar","Lohardaga","Pakur","Palamu","Ramgarh","Ranchi","Sahibganj","Seraikela Kharsawan","Simdega","West Singhbhum"],
  "karnataka": ["Bagalkot","Ballari","Belagavi","Bengaluru Rural","Bengaluru Urban","Bidar","Chamarajanagar","Chikballapur","Chikkamagaluru","Chitradurga","Dakshina Kannada","Davangere","Dharwad","Gadag","Hassan","Haveri","Kalaburagi","Kodagu","Kolar","Koppal","Mandya","Mysuru","Raichur","Ramanagara","Shivamogga","Tumakuru","Udupi","Uttara Kannada","Vijayapura","Yadgir"],
  "kerala": ["Alappuzha","Ernakulam","Idukki","Kannur","Kasaragod","Kollam","Kottayam","Kozhikode","Malappuram","Palakkad","Pathanamthitta","Thiruvananthapuram","Thrissur","Wayanad"],
  "lakshadweep": ["Lakshadweep"],
  "madhya-pradesh": ["Agar Malwa","Alirajpur","Anuppur","Ashoknagar","Balaghat","Barwani","Betul","Bhind","Bhopal","Burhanpur","Chhatarpur","Chhindwara","Damoh","Datia","Dewas","Dhar","Dindori","Guna","Gwalior","Harda","Hoshangabad","Indore","Jabalpur","Jhabua","Katni","Khandwa","Khargone","Mandla","Mandsaur","Morena","Narsinghpur","Neemuch","Panna","Raisen","Rajgarh","Ratlam","Rewa","Sagar","Satna","Sehore","Seoni","Shahdol","Shajapur","Sheopur","Shivpuri","Sidhi","Singrauli","Tikamgarh","Ujjain","Umaria","Vidisha"],
  "maharashtra": ["Ahmednagar","Akola","Amravati","Chhatrapati Sambhajinagar","Beed","Bhandara","Buldhana","Chandrapur","Dhule","Gadchiroli","Gondia","Hingoli","Jalgaon","Jalna","Kolhapur","Latur","Mumbai City","Mumbai Suburban","Nagpur","Nanded","Nandurbar","Nashik","Dharashiv","Palghar","Parbhani","Pune","Raigad","Ratnagiri","Sangli","Satara","Sindhudurg","Solapur","Thane","Wardha","Washim","Yavatmal"],
  "manipur": ["Bishnupur","Chandel","Churachandpur","Imphal East","Imphal West","Jiribam","Kakching","Kamjong","Kangpokpi","Noney","Pherzawl","Senapati","Tamenglong","Tengnoupal","Thoubal","Ukhrul"],
  "meghalaya": ["East Garo Hills","East Jaintia Hills","East Khasi Hills","North Garo Hills","Ri Bhoi","South Garo Hills","South West Garo Hills","South West Khasi Hills","West Garo Hills","West Jaintia Hills","West Khasi Hills"],
  "mizoram": ["Aizawl","Champhai","Kolasib","Lawngtlai","Lunglei","Mamit","Saiha","Serchhip"],
  "nct-of-delhi": ["Central Delhi","East Delhi","New Delhi","North Delhi","North East Delhi","North West Delhi","Shahdara","South Delhi","South East Delhi","South West Delhi","West Delhi"],
  "nagaland": ["Dimapur","Kiphire","Kohima","Longleng","Mokokchung","Mon","Peren","Phek","Tuensang","Wokha","Zunheboto"],
  "odisha": ["Angul","Balangir","Balasore","Bargarh","Bhadrak","Boudh","Cuttack","Deogarh","Dhenkanal","Gajapati","Ganjam","Jagatsinghapur","Jajpur","Jharsuguda","Kalahandi","Kandhamal","Kendrapara","Kendujhar","Khordha","Koraput","Malkangiri","Mayurbhanj","Nabarangpur","Nayagarh","Nuapada","Puri","Rayagada","Sambalpur","Sonepur","Sundargarh"],
  "puducherry": ["Karaikal","Mahe","Puducherry","Yanam"],
  "punjab": ["Amritsar","Barnala","Bathinda","Faridkot","Fatehgarh Sahib","Fazilka","Ferozepur","Gurdaspur","Hoshiarpur","Jalandhar","Kapurthala","Ludhiana","Mansa","Moga","Muktsar","Nawanshahr","Pathankot","Patiala","Rupnagar","Mohali","Sangrur","Tarn Taran"],
  "rajasthan": ["Ajmer","Alwar","Banswara","Baran","Barmer","Bharatpur","Bhilwara","Bikaner","Bundi","Chittorgarh","Churu","Dausa","Dholpur","Dungarpur","Hanumangarh","Jaipur","Jaisalmer","Jalore","Jhalawar","Jhunjhunu","Jodhpur","Karauli","Kota","Nagaur","Pali","Pratapgarh","Rajsamand","Sawai Madhopur","Sikar","Sirohi","Sri Ganganagar","Tonk","Udaipur"],
  "sikkim": ["East Sikkim","North Sikkim","South Sikkim","West Sikkim"],
  "tamil-nadu": ["Ariyalur","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul","Erode","Kanchipuram","Kanyakumari","Karur","Krishnagiri","Madurai","Nagapattinam","Namakkal","Nilgiris","Perambalur","Pudukkottai","Ramanathapuram","Salem","Sivaganga","Thanjavur","Theni","Thoothukudi","Tiruchirappalli","Tirunelveli","Tiruppur","Tiruvallur","Tiruvannamalai","Tiruvarur","Vellore","Viluppuram","Virudhunagar"],
  "telangana": ["Adilabad","Bhadradri Kothagudem","Hyderabad","Jagtial","Jangaon","Jayashankar Bhoopalpally","Jogulamba Gadwal","Kamareddy","Karimnagar","Khammam","Komaram Bheem Asifabad","Mahabubabad","Mahabubnagar","Mancherial","Medak","Medchal Malkajgiri","Nagarkurnool","Nalgonda","Nirmal","Nizamabad","Peddapalli","Rajanna Sircilla","Rangareddy","Sangareddy","Siddipet","Suryapet","Vikarabad","Wanaparthy","Warangal Rural","Warangal Urban","Yadadri Bhuvanagiri"],
  "tripura": ["Dhalai","Gomati","Khowai","North Tripura","Sepahijala","South Tripura","Unakoti","West Tripura"],
  "uttarakhand": ["Almora","Bageshwar","Chamoli","Champawat","Dehradun","Haridwar","Nainital","Pauri Garhwal","Pithoragarh","Rudraprayag","Tehri Garhwal","Udham Singh Nagar","Uttarkashi"],
  "uttar-pradesh": ["Agra","Aligarh","Prayagraj","Ambedkar Nagar","Amethi","Amroha","Auraiya","Azamgarh","Baghpat","Bahraich","Ballia","Balrampur","Banda","Barabanki","Bareilly","Basti","Bhadohi","Bijnor","Budaun","Bulandshahr","Chandauli","Chitrakoot","Deoria","Etah","Etawah","Ayodhya","Farrukhabad","Fatehpur","Firozabad","Gautam Buddha Nagar","Ghaziabad","Ghazipur","Gonda","Gorakhpur","Hamirpur","Hapur","Hardoi","Hathras","Jalaun","Jaunpur","Jhansi","Kannauj","Kanpur Dehat","Kanpur Nagar","Kasganj","Kaushambi","Kushinagar","Lakhimpur Kheri","Lalitpur","Lucknow","Maharajganj","Mahoba","Mainpuri","Mathura","Mau","Meerut","Mirzapur","Moradabad","Muzaffarnagar","Pilibhit","Pratapgarh","Raebareli","Rampur","Saharanpur","Sambhal","Sant Kabir Nagar","Shahjahanpur","Shamli","Shravasti","Siddharth Nagar","Sitapur","Sonbhadra","Sultanpur","Unnao","Varanasi"],
  "west-bengal": ["Alipurduar","Bankura","Birbhum","Purba Bardhaman","Paschim Bardhaman","Cooch Behar","Dakshin Dinajpur","Darjeeling","Hooghly","Howrah","Jalpaiguri","Kalimpong","Kolkata","Malda","Murshidabad","Nadia","North 24 Parganas","Paschim Medinipur","Purba Medinipur","Purulia","South 24 Parganas","Uttar Dinajpur","Jhargram"]
};

export const KOLKATA_NO_BLOCKS = "kolkata";

export const SEED_BLOCKS: Record<string, string[] | string> = {
  "alipurduar": ["Madarihat-Birpara","Alipurduar I","Alipurduar II","Kalchini","Falakata","Kumargram"],
  "bankura": ["Bankura I","Bankura II","Barjora","Chhatna","Gangajalghati","Mejia","Onda","Saltora","Indpur","Khatra","Hirbandh","Raipur","Sarenga","Ranibandh","Simlapal","Taldangra","Indas","Joypur","Patrasayer","Kotulpur","Sonamukhi","Bishnupur"],
  "birbhum": ["Suri I","Suri II","Sainthia","Mohammad Bazar","Rajnagar","Khoyrasol","Dubrajpur","Bolpur Sriniketan","Illambazar","Nanoor","Labpur","Rampurhat I","Rampurhat II","Nalhati I","Nalhati II","Mayureswar I","Mayureswar II","Murarai I","Murarai II"],
  "purba-bardhaman": ["Ausgram I","Ausgram II","Bhatar","Burdwan I","Burdwan II","Galsi I","Galsi II","Khandaghosh","Jamalpur","Memari I","Memari II","Raina I","Raina II","Kalna I","Kalna II","Manteswar","Purbasthali I","Purbasthali II","Katwa I","Katwa II","Ketugram I","Ketugram II","Mongalkote"],
  "paschim-bardhaman": ["Salanpur","Barabani","Jamuria","Raniganj","Andal","Pandabeswar","Faridpur-Durgapur","Kanksa"],
  "cooch-behar": ["Cooch Behar I","Cooch Behar II","Dinhata I","Dinhata II","Haldibari","Mathabhanga I","Mathabhanga II","Mekhliganj","Sitai","Sitalkuchi","Tufanganj I","Tufanganj II"],
  "dakshin-dinajpur": ["Balurghat","Hili","Kumarganj","Tapan","Gangarampur","Bansihari","Harirampur","Kushmandi"],
  "darjeeling": ["Darjeeling Pulbazar","Jorebunglow Sukhiapokhri","Rangli Rangliot","Mirik","Kurseong","Matigara","Naxalbari","Kharibari","Phansidewa"],
  "hooghly": ["Balagarh","Chinsurah Mogra","Dhaniakhali","Pandua","Polba Dadpur","Haripal","Singur","Tarakeswar","Chanditala I","Chanditala II","Jangipara","Serampore Uttarpara","Khanakul I","Khanakul II","Goghat I","Goghat II","Pursurah","Arambagh"],
  "howrah": ["Bally Jagachha","Domjur","Panchla","Sankrail","Jagatballavpur","Amta I","Amta II","Bagnan I","Bagnan II","Uluberia I","Uluberia II","Shyampur I","Shyampur II","Udaynarayanpur"],
  "jalpaiguri": ["Jalpaiguri","Maynaguri","Rajganj","Mal","Matiali","Nagrakata","Kranti","Dhupguri","Banarhat"],
  "kalimpong": ["Kalimpong I","Lava","Pedong","Gorubathan"],
  "kolkata": KOLKATA_NO_BLOCKS,
  "malda": ["English Bazar","Old Malda","Gazole","Habibpur","Kaliachak I","Kaliachak II","Kaliachak III","Manikchak","Bamangola","Chanchal I","Chanchal II","Ratua I","Ratua II","Harishchandrapur I","Harishchandrapur II"],
  "murshidabad": ["Berhampore","Beldanga I","Beldanga II","Hariharpara","Naoda","Raninagar I","Raninagar II","Jalangi","Domkal","Murshidabad-Jiaganj","Bhagawangola I","Bhagawangola II","Lalgola","Nabagram","Kandi","Khargram","Burwan","Bharatpur I","Bharatpur II","Raghunathganj I","Raghunathganj II","Suti I","Suti II","Samserganj","Sagardighi","Farakka"],
  "nadia": ["Chakdah","Chapra","Hanskhali","Haringhata","Kaliganj","Karimpur-1","Karimpur-Ii","Krishnaganj","Krishnagar-I","Krishnagar-Ii","Nabadwip","Nakashipara","Ranaghat-I","Ranaghat-Ii","Santipur","Tehatta-I","Tehatta-Ii"],
  "north-24-parganas": ["Rajarhat","Barrackpore I","Barrackpore II","Barasat I","Barasat II","Amdanga","Deganga","Habra I","Habra II","Bagdah","Bangaon","Gaighata","Baduria","Swarupnagar","Basirhat I","Basirhat II","Haroa","Minakhan","Hasnabad","Sandeshkhali I","Sandeshkhali II","Hingalganj"],
  "paschim-medinipur": ["Midnapore Sadar","Garhbeta I","Garhbeta II","Garhbeta III","Keshpur","Salboni","Dantan I","Dantan II","Pingla","Kharagpur I","Kharagpur II","Sabang","Mohanpur","Narayangarh","Keshiari","Debra","Chandrakona I","Chandrakona II","Daspur I","Daspur II","Ghatal"],
  "purba-medinipur": ["Tamluk","Sahid Matangini","Panskura","Nandakumar","Chandipur","Moyna","Deshapran","Mahishadal","Nandigram I","Nandigram II","Sutahata","Haldia","Contai I","Contai III","Khejuri I","Khejuri II","Ramnagar I","Ramnagar II","Bhagabanpur I","Bhagabanpur II","Egra I","Egra II","Patashpur I","Patashpur II","Kolaghat"],
  "purulia": ["Arsha","Balarampur","Hura","Purulia I","Purulia II","Barabazar","Bandwan","Manbazar I","Manbazar II","Puncha","Baghmundi","Jhalda I","Jhalda II","Joypur","Para","Raghunathpur I","Raghunathpur II","Neturia","Santuri","Kashipur"],
  "south-24-parganas": ["Thakurpukur Maheshtala","Budge Budge I","Budge Budge II","Bishnupur I","Bishnupur II","Bhangar I","Bhangar II","Sonarpur","Baruipur","Jaynagar I","Jaynagar II","Kultali","Canning I","Canning II","Basanti","Gosaba","Falta","Magrahat I","Magrahat II","Diamond Harbour I","Diamond Harbour II","Mandirbazar","Mathurapur I","Mathurapur II","Kulpi","Kakdwip","Namkhana","Patharpratima","Sagar"],
  "uttar-dinajpur": ["Raiganj","Hemtabad","Kaliaganj","Itahar","Islampur","Chopra","Goalpokhar I","Goalpokhar II","Karandighi"],
  "jhargram": ["Jhargram","Nayagram","Gopiballavpur I","Gopiballavpur II","Sankrail","Binpur I","Binpur II","Jamboni"]
};

export function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
