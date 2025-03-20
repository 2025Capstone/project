from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
import app.models.student
import app.models.video
import app.models.lecture
import app.models.drowsiness_level
import app.models.watch_history
import app.models.enrollment
import app.models.instructor