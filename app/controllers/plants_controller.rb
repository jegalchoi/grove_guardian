class PlantsController < ApplicationController
  rescue_from Exception, with: :exeception_handler
  before_action :require_owner!, only: [:show, :edit, :update, :destroy]
  before_action :find_plant_by_params_id, only: [:show, :edit, :update, :destroy]
  
  def authorized_index
    @user = User.find(params[:user_id])
    @plants = @user.plants
    if @plants && authorized_user?
      render json: {
        plants: @plants
      }
    elsif @plants && !authorized_user?
      render json: {
        status: 401,
        errors: ['You are not authorized to perform this action']
      }
    else
      render json: {
        status: 500,
        errors: ['Could not locate any plants']
      }
    end
  end

  def index
    @plants = Plant.all
    render json: @plants
  end

  def show
    if @plant
      render json: {
        plant: @plant
      }
    else
      render json: {
        status: 500,
        errors: ['Could not locate plant']
      }
    end
  end

  def create
    @plant = Plant.new(plant_params)
    if @plant.save
      render json: {
        status: :created,
        plant: @plant
      }
    else
      render json: {
        status: 500,
        errors: @plant.errors.full_messages
      }
    end
  end

  def update
    if @plant && @plant.update_attributes(plant_params)
      render json: {
        status: :updated,
        plant: @plant
      }
    elsif !@plant
      render json: {
        status: 400,
        errors: ['Could not locate plant']
      }
    else
      render json: {
        status: 401,
        errors: @plant.errors.full_messages
      }
    end
  end

  def destroy
    if @plant
      @plant.destroy
      render json: {
        status: :destroyed
      }
    else
      render json: {
        status: 500,
        errors: ['Could not locate plant']
      }
    end
  end

  private

  def plant_params
    params.require(:plant).permit(:name, :notes, :water, :private, :image, :user_id)
  end

  def find_plant_by_params_id
    @plant = Plant.find(params[:id])
  end

  def handle_unauthorized
    unless authorized_user?
      render json: {
        status: 401,
        errors: ['You are not authorized to perform this action']
      }
    end
  end

  def require_owner!
    redirect_to '/plants' unless current_user_id == find_plant_by_params_id.user_id
  end

  def exeception_handler(exception)
    case exception
    when ActiveRecord::RecordNotFound
      render json: {
        status: 400,
        errors: ['Not found']
      }
    end
  end
  
end