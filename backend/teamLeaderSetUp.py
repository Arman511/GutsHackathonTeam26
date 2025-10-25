import pandas as pd
import re
from datetime import datetime as dateTime
 
df = pd.read_csv('gutsHack.csv', encoding='latin1')

def clean_bool(value):
    if isinstance(value, str) and value.strip().lower().startswith('y'):
        return True
    return False

def extract_avg_price(price_str: str) -> float:
    s = str(price_str)
    
    s_norm = s.replace('\xa0', ' ').replace('\u2013', '-').replace('\u2014', '-').replace('\x96', '-')
    numbers = re.findall(r'\d+', s_norm)
    if len(numbers) == 0:
        
        pound_count = s_norm.count('£')
        if pound_count > 0:
            mapping = {1: 10.0, 2: 20.0, 3: 35.0, 4: 50.0}
            return mapping.get(pound_count, float('inf'))
        return float('inf')
    avgPrice = round(sum(map(int, numbers)) / len(numbers), 2)
    return avgPrice
 
df['costPerPerson'] = df['price_range'].apply(extract_avg_price)
df['outdoor'] = df['outdoor'].apply(clean_bool)
df['food'] = df['food'].apply(clean_bool)
df['pet_friendly'] = df['pet_friendly'].apply(clean_bool)
df['vegetarian'] = df['vegetarian'].apply(clean_bool)
df['accessible'] = df['accessible'].apply(lambda x: 'y' in str(x).lower())

 
def selectPotentiallocations(budget: float, numPeople: int, eventDate: dateTime, eventTime: dateTime, disabilityReq: bool = False, df=None) -> list:
    """Select potential locations within budget and time constraints."""
    budgetPerPerson = budget / numPeople
    potentiallocations = []

    def parse_datetime(val):
        if isinstance(val, dateTime):
            return val
        s = str(val)
    
        fmts = ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M", "%d-%m-%Y %H:%M:%S", "%d-%m-%Y %H:%M", "%d/%m/%Y %H:%M:%S", "%d/%m/%Y %H:%M")
        for fmt in fmts:
            try:
                return dateTime.strptime(s, fmt)
            except Exception:
                pass
        
        try:
            return pd.to_datetime(s)
        except Exception:
            raise ValueError(f"Unable to parse datetime: {val}")

    def parse_time_only(val):
        """Return a datetime.time or None. Accepts time strings like '09:00', '9am', full datetimes, or None."""
        if val is None or (isinstance(val, float) and pd.isna(val)):
            return None
        if isinstance(val, dateTime):
            return val.time()
        s = str(val).strip()
        
        m = re.search(r"(\d{1,2}:\d{2}\s*(?:am|pm)?)", s, flags=re.I)
        if m:
            ts = m.group(1)
            for fmt in ("%H:%M", "%I:%M%p", "%I:%M %p"):
                try:
                    return dateTime.strptime(ts, fmt).time()
                except Exception:
                    pass
        
        try:
            dt = pd.to_datetime(s)
            return dt.time()
        except Exception:
            return None

    
    try:
        event_dt = parse_datetime(eventTime)
    except Exception:
        return potentiallocations

    for _, row in df.iterrows():
        if row.get('costPerPerson') is None or row.get('costPerPerson') > budgetPerPerson:
            continue

        if disabilityReq:
            if 'accessible' not in df.columns:
                continue
            if not row.get('accessible'):
                continue

        
        open_t = None
        close_t = None
        if 'open_time' in df.columns:
            open_t = parse_time_only(row.get('open_time'))
        if 'close_time' in df.columns:
            close_t = parse_time_only(row.get('close_time'))

        if open_t is not None:
            ev_t = event_dt.time()
            if close_t is not None:
                
                if open_t <= close_t:
                    if not (open_t <= ev_t <= close_t):
                        continue
                else:
                    
                    if not (ev_t >= open_t or ev_t <= close_t):
                        continue
            else:
                
                if ev_t < open_t:
                    continue

        potentiallocations.append(row.to_dict())


    return potentiallocations

# demoLocationsToConsider = selectPotentiallocations(60, 3, eventDate = "12-02-2025", eventTime = "12-02-2025 23:50:00", df = df)
# print(f"Found {len(demoLocationsToConsider)} potential locations:")
# print(demoLocationsToConsider)