from typing import Set
import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI()

# Load model
model = joblib.load('xgb_model(1).pkl')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================================== Initialisations ======================================================

# Converted to a set with proper comma separation
TOP_LOCATIONS: Set[str] = {
    'Electronic City Phase II', 'Chikka Tirupathi', 'Uttarahalli', 'Lingadheeranahalli', 
    'Kothanur', 'Whitefield', 'Old Airport Road', 'Rajaji Nagar', 'Marathahalli', 
    'Other', '7th Phase JP Nagar', 'Gottigere', 'Sarjapur', 'Mysore Road', 
    'Bisuvanahalli', 'Raja Rajeshwari Nagar', 'Kengeri', 'Binny Pete', 'Thanisandra', 
    'Bellandur', 'Electronic City', 'Ramagondanahalli', 'Yelahanka', 'Hebbal', 
    'Kasturi Nagar', 'Kanakpura Road', 'Electronics City Phase 1', 'Kundalahalli', 
    'Chikkalasandra', 'Murugeshpalya', 'Sarjapur  Road', 'Ganga Nagar', 'HSR Layout', 
    'Doddathoguru', 'KR Puram', 'Bhoganhalli', 'Lakshminarayana Pura', 'Begur Road', 
    'Devanahalli', 'Varthur', 'Bommanahalli', 'Gunjur', 'Hegde Nagar', 'Haralur Road', 
    'Hennur Road', 'Kothannur', 'Kalena Agrahara', 'Kaval Byrasandra', 'ISRO Layout', 
    'Garudachar Palya', 'EPIP Zone', 'Dasanapura', 'Kasavanhalli', 'Sanjay nagar', 
    'Domlur', 'Sarjapura - Attibele Road', 'Yeshwanthpur', 'Chandapura', 'Nagarbhavi', 
    'Ramamurthy Nagar', 'Malleshwaram', 'Akshaya Nagar', 'Shampura', 'Kadugodi', 
    'LB Shastri Nagar', 'Hormavu', 'Vishwapriya Layout', 'Kudlu Gate', 
    '8th Phase JP Nagar', 'Bommasandra Industrial Area', 'Anandapura', 
    'Vishveshwarya Layout', 'Kengeri Satellite Town', 'Kannamangala', 
    ' Devarachikkanahalli', 'Hulimavu', 'Mahalakshmi Layout', 'Hosa Road', 
    'Attibele', 'CV Raman Nagar', 'Kumaraswami Layout', 'Nagavara', 
    'Hebbal Kempapura', 'Vijayanagar', 'Pattandur Agrahara', 'Nagasandra', 
    'Kogilu', 'Panathur', 'Padmanabhanagar', '1st Block Jayanagar', 'Kammasandra', 
    'Dasarahalli', 'Magadi Road', 'Koramangala', 'Dommasandra', 'Budigere', 
    'Kalyan nagar', 'OMBR Layout', 'Horamavu Agara', 'Ambedkar Nagar', 
    'Talaghattapura', 'Balagere', 'Jigani', 'Gollarapalya Hosahalli', 
    'Old Madras Road', 'Kaggadasapura', '9th Phase JP Nagar', 'Jakkur', 
    'TC Palaya', 'Giri Nagar', 'Singasandra', 'AECS Layout', 'Mallasandra', 
    'Begur', 'JP Nagar', 'Malleshpalya', 'Munnekollal', 'Kaggalipura', 
    '6th Phase JP Nagar', 'Ulsoor', 'Thigalarapalya', 'Somasundara Palya', 
    'Basaveshwara Nagar', 'Bommasandra', 'Ardendale', 'Harlur', 'Kodihalli', 
    'Bannerghatta Road', 'Hennur', '5th Phase JP Nagar', 'Kodigehaali', 
    'Billekahalli', 'Jalahalli', 'Mahadevpura', 'Anekal', 'Sompura', 
    'Dodda Nekkundi', 'Hosur Road', 'Battarahalli', 'Sultan Palaya', 'Ambalipura', 
    'Hoodi', 'Brookefield', 'Yelenahalli', 'Vittasandra', '2nd Stage Nagarbhavi', 
    'Vidyaranyapura', 'Amruthahalli', 'Kodigehalli', 'Subramanyapura', 
    'Basavangudi', 'Kenchenahalli', 'Banjara Layout', 'Kereguddadahalli', 
    'Kambipura', 'Banashankari Stage III', 'Sector 7 HSR Layout', 'Rajiv Nagar', 
    'Arekere', 'Mico Layout', 'Kammanahalli', 'Banashankari', 'Chikkabanavar', 
    'HRBR Layout', 'Nehru Nagar', 'Kanakapura', 'Konanakunte', 'Margondanahalli', 
    'R.T. Nagar', 'Tumkur Road', 'Vasanthapura', 'GM Palaya', 'Jalahalli East', 
    'Hosakerehalli', 'Indira Nagar', 'Kodichikkanahalli', 'Varthur Road', 
    'Anjanapura', 'Abbigere', 'Tindlu', 'Gubbalala', 'Dairy Circle', 
    'Cunningham Road', 'Kudlu', 'Banashankari Stage VI', 'Cox Town', 
    'Kathriguppe', 'HBR Layout', 'Yelahanka New Town', 'Sahakara Nagar', 
    'Rachenahalli', 'Sadashiva Nagar', 'Yelachenahalli', 'Green Glen Layout', 
    'Thubarahalli', 'Naganathapura', 'Horamavu Banaswadi', '1st Phase JP Nagar', 
    'NGR Layout', 'Seegehalli', 'NRI Layout', 'ITPL', 'Babusapalaya', 
    'Nagappa Reddy Layout', 'BTM 1st Stage', 'Iblur Village', 'Ananth Nagar', 
    'Channasandra', 'Choodasandra', 'Kaikondrahalli', 'Neeladri Nagar', 
    'Frazer Town', 'Cooke Town', 'Doddakallasandra', 'Chamrajpet', 'Rayasandra', 
    'Kalkere', '5th Block Hbr Layout', 'Pai Layout', 'Banashankari Stage V', 
    'Sonnenahalli', 'Benson Town', 'Poorna Pragna Layout', 'Judicial Layout', 
    'Banashankari Stage II', 'Karuna Nagar', 'Bannerghatta', 'Marsur', 
    'Bommenahalli', 'Laggere', 'Prithvi Layout', 'Banaswadi', 
    'Sector 2 HSR Layout', 'Shivaji Nagar', 'Nagavarapalya', 'BTM Layout', 
    'BTM 2nd Stage', '1st Block Koramangala', 'Hoskote', 'Doddaballapur', 
    'Gunjur Palya', 'Sarakki Nagar', 'Thyagaraja Nagar', 'Bharathi Nagar', 
    'Dodsworth Layout', 'HAL 2nd Stage', 'Kadubeesanahalli'
}

# ================================== Main Functions ======================================================

# Pydantic input schema (renamed class to HouseInput for Python standard naming)
class HouseInput(BaseModel):
    size: int = Field(..., ge=1, le=50, description="Number of bedrooms/BHK")
    total_sqft: float = Field(..., gt=0, description="Total area in square feet")
    location: str = Field(..., min_length=1, description="Location or neighborhood name")


# Response schema
class PredictionResponse(BaseModel):
    predicted_price: float


@app.get('/')
def home():
    return {"message": "Welcome to my house price prediction API"}


@app.post('/predict', response_model=PredictionResponse)
def predict(data: HouseInput):
    location = data.location if data.location in TOP_LOCATIONS else "Other"

    # Ensure column order matches exact feature order during model training
    input_row = pd.DataFrame([{
        'location': location,
        'size': data.size,
        'total_sqft': data.total_sqft
    }])

    prediction = model.predict(input_row)[0]
    
    return PredictionResponse(predicted_price=round(float(prediction), 2))