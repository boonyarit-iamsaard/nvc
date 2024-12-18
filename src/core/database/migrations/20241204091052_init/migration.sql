-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show', 'on_hold', 'expired');

-- CreateEnum
CREATE TYPE "BookingPaymentStatus" AS ENUM ('pending', 'paid', 'failed', 'refunded', 'disputed', 'cancelled');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('administrator', 'guest', 'member', 'owner');

-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('email_verification', 'password_reset');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified_at" TIMESTAMP(3),
    "first_login_at" TIMESTAMP(3),
    "hashed_password" TEXT NOT NULL,
    "image" TEXT,
    "gender" "Gender" NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'guest',
    "stripe_customer_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_types" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "description" TEXT,
    "price_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "room_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_prices" (
    "id" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "weekend" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "room_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "room_id" TEXT,
    "bookingNumber" TEXT NOT NULL,
    "check_in" TIMESTAMP(3) NOT NULL,
    "check_out" TIMESTAMP(3) NOT NULL,
    "guest_name" TEXT NOT NULL,
    "guest_email" TEXT NOT NULL,
    "guest_membership_name" TEXT,
    "guest_membership_number" TEXT,
    "stripe_customer_id" TEXT,
    "room_type_name" TEXT NOT NULL,
    "room_name" TEXT NOT NULL,
    "weekday_count" INTEGER NOT NULL,
    "weekend_count" INTEGER NOT NULL,
    "weekday_price_at_booking" INTEGER NOT NULL,
    "weekend_price_at_booking" INTEGER NOT NULL,
    "base_amount" INTEGER NOT NULL,
    "discount_amount" INTEGER NOT NULL,
    "discount_percentage" INTEGER NOT NULL DEFAULT 0,
    "total_amount" INTEGER NOT NULL,
    "booking_status" "BookingStatus" NOT NULL DEFAULT 'pending',
    "payment_status" "BookingPaymentStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "price_id" TEXT NOT NULL,
    "room_discount" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membership_prices" (
    "id" TEXT NOT NULL,
    "male" INTEGER NOT NULL DEFAULT 0,
    "female" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "membership_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membership_sequences" (
    "id" TEXT NOT NULL,
    "membership_code" TEXT NOT NULL,
    "last_assigned_sequence" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "membership_sequences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_memberships" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "membership_id" TEXT,
    "membership_number" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_gender" "Gender" NOT NULL,
    "membership_name" TEXT NOT NULL,
    "membership_price_at_joining" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_verifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "type" "VerificationType" NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invalid_at" TIMESTAMP(3),

    CONSTRAINT "user_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "room_types_name_key" ON "room_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "room_types_code_key" ON "room_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "room_types_price_id_key" ON "room_types"("price_id");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_name_key" ON "rooms"("name");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_bookingNumber_key" ON "bookings"("bookingNumber");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_name_key" ON "memberships"("name");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_code_key" ON "memberships"("code");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_price_id_key" ON "memberships"("price_id");

-- CreateIndex
CREATE UNIQUE INDEX "membership_sequences_membership_code_key" ON "membership_sequences"("membership_code");

-- CreateIndex
CREATE UNIQUE INDEX "user_verifications_token_key" ON "user_verifications"("token");

-- CreateIndex
CREATE INDEX "user_verifications_token_idx" ON "user_verifications"("token");

-- CreateIndex
CREATE INDEX "user_verifications_user_id_idx" ON "user_verifications"("user_id");

-- AddForeignKey
ALTER TABLE "room_types" ADD CONSTRAINT "room_types_price_id_fkey" FOREIGN KEY ("price_id") REFERENCES "room_prices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "room_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_price_id_fkey" FOREIGN KEY ("price_id") REFERENCES "membership_prices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_memberships" ADD CONSTRAINT "user_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_memberships" ADD CONSTRAINT "user_memberships_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "memberships"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_verifications" ADD CONSTRAINT "user_verifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
