-- DropIndex
DROP INDEX "UserProfile_userName_key";

-- CreateIndex
CREATE INDEX "UserProfile_userName_idx" ON "UserProfile"("userName");

-- CreateIndex
CREATE INDEX "UserProfile_country_idx" ON "UserProfile"("country");

-- CreateIndex
CREATE INDEX "UserProfile_city_idx" ON "UserProfile"("city");
