from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, DateTime, extract, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta, date
from typing import Optional, List, Dict
import os
import cv2
import uuid
import requests
from ultralytics import YOLO
from deepface import DeepFace
import csv
from fastapi.middleware.cors import CORSMiddleware

# please follow this quick guide when making requests
# 1. crowd analysis
# POST /crowd_analysis/
# Body: {"video_path": "/path/to/video.mp4"}

# 2. describe image
# POST /describe_image/
# Body: {"base64_image": "base64_string (jpeg preffered)"}

# 3. insert person in compare table
# POST /insert_person/
# Form Data: {"name": "alex", "file": alex.jpg}

# 4. Pfacee compare
# POST /perform_face_recognition/
# Body: {"name": "alex"}

# 5. get matched people
# GET /get_matched_people/

# 6. emotion grapth 
# POST /emotion_distribution/
# Body: {"year": 2024, "month": 8}
# Or Body: {"day": "2024-08-19"}

# 7. age grapth
# POST /age_distribution/
# Body: {"year": 2024, "month": 8}
# Or Body: {"day": "2024-08-19"}

# 8. gender graph
# POST /gender_distribution/
# Body: {"year": 2024, "month": 8}
# Or Body: {"day": "2024-08-19"}

# 9. eithnicity grapth
# POST /ethnicity_distribution/
# Body: {"year": 2024, "month": 8}
# Or Body: {"day": "2024-08-19"}

# 10. common person graph
# POST /most_common_person/
# Body: {"year": 2024, "month": 8}
# Or Body: {"day": "2024-08-19"}

# 11. crowd density 
# POST /crowd_density/
# Body: {"year": 2024, "month": 8}
# Or Body: {"day": "2024-08-19"}

# 12. to csv
# GET /export_db/

app = FastAPI()
#fixware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,  # Set to True if credentials are sent in requests
    allow_methods=["*"],  # Allow all HTTP methods (adjust as needed)
    allow_headers=["*"],  # Allow all headers (adjust as needed)
)



# SQLAlchemy setup
Base = declarative_base()

class DetectedPerson(Base):
    __tablename__ = 'table_detected'
    id = Column(Integer, primary_key=True, autoincrement=True)
    age = Column(Integer)
    gender = Column(String)
    race = Column(String)
    emotion = Column(String)
    uuid = Column(String)
    detection_time = Column(DateTime)

class ComparePerson(Base):
    __tablename__ = 'table_compare'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    uuid = Column(String)

# SQLite setup
engine = create_engine('sqlite:///detected_people.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

# pydantic setup (to force correct input)
class VideoInput(BaseModel):
    video_path: str

class ImageInput(BaseModel):
    base64_image: str

class PersonInput(BaseModel):
    name: str
    uuid: str

class FaceRecognitionInput(BaseModel):
    name: str

class AnalyticsRequest(BaseModel):
    year: Optional[int] = None
    month: Optional[int] = None
    week: Optional[int] = None
    day: Optional[date] = None

# help functions
def get_filtered_query(request: AnalyticsRequest):
    query = session.query(DetectedPerson)

    if request.year:
        query = query.filter(extract('year', DetectedPerson.detection_time) == request.year)
    if request.month:
        query = query.filter(extract('month', DetectedPerson.detection_time) == request.month)
    if request.week:
        start_date = datetime.strptime(f"{request.year}-W{int(request.week)}-1", "%Y-W%W-%w").date()
        end_date = start_date + timedelta(days=6.9)
        query = query.filter(DetectedPerson.detection_time.between(start_date, end_date))
    if request.day:
        query = query.filter(extract('day', DetectedPerson.detection_time) == request.day.day)

    return query

def calculate_percentages(data: List[Dict[str, int]], total_count: int):
    return {k: (v / total_count) * 100 for k, v in data.items()}


# 1. crowd analysis endpoint
@app.post("/crowd_analysis/")
async def crowd_analysis(video_input: VideoInput):
    output_dir = "detected"
    os.makedirs(output_dir, exist_ok=True)
    video_input_path = video_input.video_path

    model = YOLO("yolov8n-person.pt")
    cap = cv2.VideoCapture(video_input_path)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        results = model(frame)[0]

        for result in results.boxes.data.tolist():
            x1, y1, x2, y2, _, _ = result
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)

            cropped_person = frame[y1:y2, x1:x2]
            image_uuid = uuid.uuid4().hex
            filename = os.path.join(output_dir, f"{image_uuid}.jpg")

            cv2.imwrite(filename, cropped_person)

            try:
                objs = DeepFace.analyze(img_path=filename, actions=['age', 'gender', 'race', 'emotion'])

                for obj in objs:
                    detected_person = DetectedPerson(
                        age=obj['age'],
                        gender=obj['dominant_gender'],
                        race=obj['dominant_race'],
                        emotion=obj['dominant_emotion'],
                        uuid=image_uuid,
                        detection_time=datetime.now()
                    )
                    session.add(detected_person)
                    session.commit()

            except ValueError as e:
                print(f"Error: {e} - Skipping to next detected person.")

    cap.release()
    return {"message": "Video processing completed"}

# 2. describe image with gpt
@app.post("/describe_image/")
async def describe_image(image_input: ImageInput):
    api_key = "Enter API KEY"
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

    payload = {
        "model": "gpt-4o",
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant that describes images."
            },
            {
                "role": "user",
                "content": f"Describe this image: data:image/jpeg;base64,{image_input.base64_image}"
            }
        ],
        "max_tokens": 50
    }

    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

    if response.status_code == 200:
        return response.json()
    else:
        raise HTTPException(status_code=response.status_code, detail="Failed to describe the image")

# 3. insert person
@app.post("/insert_person/")
async def insert_person(name: str = Form(...), file: UploadFile = File(...)):
    output_dir = "person_images"
    os.makedirs(output_dir, exist_ok=True)

    image_uuid = uuid.uuid4().hex
    filename = f"{image_uuid}.png"
    file_path = os.path.join(output_dir, filename)

    with open(file_path, "wb") as image_file:
        image_file.write(await file.read())

    new_person = ComparePerson(name=name, uuid=filename)
    session.add(new_person)
    session.commit()

    return {"message": f"Record inserted successfully for {name} with UUID {filename}."}

# 4. facee compare and face find
@app.post("/perform_face_recognition/")
async def perform_face_recognition(input_data: FaceRecognitionInput):
    detect_folder = "detected"
    matched_people = []

    for image_file in os.listdir(detect_folder):
        image_path = os.path.join(detect_folder, image_file)

        try:
            results = DeepFace.find(img_path=image_path, db_path=detect_folder, enforce_detection=False, silent=True)

            if len(results) > 0:
                matched_uuid = os.path.splitext(image_file)[0]
                detected_person = session.query(DetectedPerson).filter_by(uuid=matched_uuid).first()

                if detected_person:
                    new_person = ComparePerson(name=input_data.name, uuid=matched_uuid)
                    session.add(new_person)
                    session.commit()

                    matched_people.append({
                        "name": input_data.name,
                        "uuid": matched_uuid,
                        "age": detected_person.age,
                        "gender": detected_person.gender,
                        "race": detected_person.race,
                        "emotion": detected_person.emotion,
                        "detection_time": detected_person.detection_time
                    })

        except Exception as e:
            print(f"Error processing {image_file}: {e}")

    return {"matched_people": matched_people}

# 5. get matched people
@app.get("/get_matched_people/")
async def get_matched_people():
    matched_people = []

    # query the records
    compared_people = session.query(ComparePerson).all()

    for person in compared_people:
        detected_person = session.query(DetectedPerson).filter_by(uuid=person.uuid).first()

        if detected_person:
            matched_people.append({
                "name": person.name,
                "uuid": person.uuid,
                "age": detected_person.age,
                "gender": detected_person.gender,
                "race": detected_person.race,
                "emotion": detected_person.emotion,
                "detection_time": detected_person.detection_time.strftime("%Y-%m-%d %H:%M:%S")
            })

    return {"matched_people": matched_people}

# analysis endpoints start here
# 1. emotion graph
@app.post("/emotion_distribution/")
async def emotion_distribution(request: AnalyticsRequest):
    query = get_filtered_query(request)
    detected_people = query.all()

    if not detected_people:
        raise HTTPException(status_code=404, detail="No records found for the specified period")

    emotion_counts = {}
    total_count = len(detected_people)

    for person in detected_people:
        emotion = person.emotion
        if emotion in emotion_counts:
            emotion_counts[emotion] += 1
        else:
            emotion_counts[emotion] = 1

    emotion_percentages = calculate_percentages(emotion_counts, total_count)
    return {"emotion_distribution": emotion_percentages}

# 2. age graph
@app.post("/age_distribution/")
async def age_distribution(request: AnalyticsRequest):
    query = get_filtered_query(request)
    detected_people = query.all()

    if not detected_people:
        raise HTTPException(status_code=404, detail="No records found for the specified period")

    age_intervals = {
        "0-10": 0,
        "11-20": 0,
        "21-30": 0,
        "31-40": 0,
        "41-50": 0,
        "51-60": 0,
        "61-70": 0,
        "71-80": 0,
        "81-90": 0,
        "91-100": 0,
        "100+": 0
    }

    total_count = len(detected_people)

    for person in detected_people:
        age = person.age
        if age <= 10:
            age_intervals["0-10"] += 1
        elif age <= 20:
            age_intervals["11-20"] += 1
        elif age <= 30:
            age_intervals["21-30"] += 1
        elif age <= 40:
            age_intervals["31-40"] += 1
        elif age <= 50:
            age_intervals["41-50"] += 1
        elif age <= 60:
            age_intervals["51-60"] += 1
        elif age <= 70:
            age_intervals["61-70"] += 1
        elif age <= 80:
            age_intervals["71-80"] += 1
        elif age <= 90:
            age_intervals["81-90"] += 1
        elif age <= 100:
            age_intervals["91-100"] += 1
        else:
            age_intervals["100+"] += 1

    age_distribution_percentages = calculate_percentages(age_intervals, total_count)
    return {"age_distribution": age_distribution_percentages}

# 3. gender graph
@app.post("/gender_distribution/")
async def gender_distribution(request: AnalyticsRequest):
    query = get_filtered_query(request)
    detected_people = query.all()

    if not detected_people:
        raise HTTPException(status_code=404, detail="No records found for the specified period")

    gender_counts = {}
    total_count = len(detected_people)

    for person in detected_people:
        gender = person.gender
        if gender in gender_counts:
            gender_counts[gender] += 1
        else:
            gender_counts[gender] = 1

    gender_percentages = calculate_percentages(gender_counts, total_count)
    return {"gender_distribution": gender_percentages}

# 4. race graph
@app.post("/ethnicity_distribution/")
async def ethnicity_distribution(request: AnalyticsRequest):
    query = get_filtered_query(request)
    detected_people = query.all()

    if not detected_people:
        raise HTTPException(status_code=404, detail="No records found for the specified period")

    race_counts = {}
    total_count = len(detected_people)

    for person in detected_people:
        race = person.race
        if race in race_counts:
            race_counts[race] += 1
        else:
            race_counts[race] = 1

    race_percentages = calculate_percentages(race_counts, total_count)
    return {"ethnicity_distribution": race_percentages}

# 5. common person graph 
@app.post("/most_common_person/")
async def most_common_person(request: AnalyticsRequest):
    query = get_filtered_query(request)
    detected_people = query.all()

    if not detected_people:
        raise HTTPException(status_code=404, detail="No records found for the specified period")

    person_combinations = {}

    for person in detected_people:
        key = (person.gender, person.age // 10 * 10, person.race, person.emotion)  # e.g., ('male', 20, 'asian', 'happy')
        if key in person_combinations:
            person_combinations[key] += 1
        else:
            person_combinations[key] = 1

    most_common = max(person_combinations, key=person_combinations.get)
    return {
        "most_common_person": {
            "gender": most_common[0],
            "age_interval": f"{most_common[1]}-{most_common[1] + 9}",
            "race": most_common[2],
            "emotion": most_common[3]
        }
    }

# 6. density graph 
@app.post("/crowd_density/")
async def crowd_density(request: AnalyticsRequest):
    query = get_filtered_query(request)
    total_count = query.count()

    return {"crowd_density": total_count}

# 7. export to .csv file 
@app.get("/export_db/")
async def export_db():
    file_path = "detected_people.csv"
    
    with open(file_path, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['ID', 'Age', 'Gender', 'Race', 'Emotion', 'UUID', 'Detection Time'])

        for person in session.query(DetectedPerson).all():
            writer.writerow([person.id, person.age, person.gender, person.race, person.emotion, person.uuid, person.detection_time])

    if os.path.exists(file_path):
        return {"message": f"Database exported successfully to {file_path}"}
    else:
        raise HTTPException(status_code=500, detail="Failed to export database")
    

@app.post("/busiest_hour/")
async def busiest_hour(request: AnalyticsRequest):
    if not request.day:
        raise HTTPException(status_code=400, detail="The 'day' field is required for this request.")

    query = session.query(
        extract('hour', DetectedPerson.detection_time).label('hour'),
        func.count(DetectedPerson.id).label('count')
    ).filter(
        extract('year', DetectedPerson.detection_time) == request.day.year,
        extract('month', DetectedPerson.detection_time) == request.day.month,
        extract('day', DetectedPerson.detection_time) == request.day.day
    ).group_by('hour').order_by(func.count(DetectedPerson.id).desc())

    result = query.first()

    if not result:
        raise HTTPException(status_code=404, detail="No records found for the specified day")

    return {"busiest_hour": result.hour, "density": result.count}
