CREATE EXTENSION IF NOT EXISTS postgis;

CREATE OR REPLACE FUNCTION set_branch_location()
RETURNS TRIGGER AS $$
BEGIN
  NEW.location := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_set_branch_location
BEFORE INSERT OR UPDATE ON branches
FOR EACH ROW
EXECUTE FUNCTION set_branch_location();

