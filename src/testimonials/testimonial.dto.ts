import { IsString, IsNotEmpty, IsOptional, IsEnum, Min, Max, IsInt } from 'class-validator';

export enum TestimonialStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

export class CreateTestimonialDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @IsEnum(TestimonialStatus)
    @IsOptional()
    status?: TestimonialStatus;
}

export class UpdateTestimonialDto {
    @IsEnum(TestimonialStatus)
    @IsNotEmpty()
    status: TestimonialStatus;
}
