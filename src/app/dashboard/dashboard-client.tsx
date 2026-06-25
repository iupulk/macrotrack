"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Calculator, Target, TrendingUp, Clock, Utensils, LogOut } from "lucide-react"
import Link from "next/link"

interface MealItem {
  id: string
  name: string
  quantity: number
  unit: string
  calories: number
  protein: number
  carbs: number
  fat: number
  mealType: string
  time: string
}

interface DailyTargets {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export function DashboardClient() {
  const router = useRouter()
  const [meals, setMeals] = useState<MealItem[]>([])
  const [newMeal, setNewMeal] = useState({
    name: "",
    quantity: "",
    unit: "grams",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    mealType: "breakfast",
  })

  // Daily targets (these would typically come from user profile/settings)
  const dailyTargets: DailyTargets = {
    calories: 2200,
    protein: 165, // grams
    carbs: 220, // grams
    fat: 73, // grams
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/")
    router.refresh()
  }

  const addMeal = () => {
    if (!newMeal.name || !newMeal.quantity || !newMeal.calories) return

    const meal: MealItem = {
      id: Date.now().toString(),
      name: newMeal.name,
      quantity: Number.parseFloat(newMeal.quantity),
      unit: newMeal.unit,
      calories: Number.parseFloat(newMeal.calories),
      protein: Number.parseFloat(newMeal.protein) || 0,
      carbs: Number.parseFloat(newMeal.carbs) || 0,
      fat: Number.parseFloat(newMeal.fat) || 0,
      mealType: newMeal.mealType,
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    setMeals([...meals, meal])
    setNewMeal({
      name: "",
      quantity: "",
      unit: "grams",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      mealType: "breakfast",
    })
  }

  const removeMeal = (id: string) => {
    setMeals(meals.filter((meal) => meal.id !== id))
  }

  // Calculate totals
  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  )

  // Calculate percentages for progress bars
  const getPercentage = (current: number, target: number) => Math.min((current / target) * 100, 100)

  // Group meals by type
  const mealsByType = meals.reduce(
    (acc, meal) => {
      if (!acc[meal.mealType]) acc[meal.mealType] = []
      acc[meal.mealType].push(meal)
      return acc
    },
    {} as Record<string, MealItem[]>,
  )

  const mealTypes = ["breakfast", "lunch", "dinner", "snacks"]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Calculator className="h-8 w-8 text-green-600" />
                <span className="text-xl font-bold">MacroTrack</span>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-2xl font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Meal Entry Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Meal
                </CardTitle>
                <CardDescription>Enter the details of your meal to track your macros</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meal-name">Food Name</Label>
                  <Input
                    id="meal-name"
                    placeholder="e.g., Grilled Chicken Breast"
                    value={newMeal.name}
                    onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="100"
                      value={newMeal.quantity}
                      onChange={(e) => setNewMeal({ ...newMeal, quantity: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select value={newMeal.unit} onValueChange={(value) => setNewMeal({ ...newMeal, unit: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grams">Grams</SelectItem>
                        <SelectItem value="oz">Ounces</SelectItem>
                        <SelectItem value="cups">Cups</SelectItem>
                        <SelectItem value="pieces">Pieces</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meal-type">Meal Type</Label>
                  <Select
                    value={newMeal.mealType}
                    onValueChange={(value) => setNewMeal({ ...newMeal, mealType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snacks">Snacks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Nutritional Information</h4>

                  <div className="space-y-2">
                    <Label htmlFor="calories">Calories *</Label>
                    <Input
                      id="calories"
                      type="number"
                      placeholder="250"
                      value={newMeal.calories}
                      onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="protein">Protein (g)</Label>
                      <Input
                        id="protein"
                        type="number"
                        placeholder="25"
                        value={newMeal.protein}
                        onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="carbs">Carbs (g)</Label>
                      <Input
                        id="carbs"
                        type="number"
                        placeholder="0"
                        value={newMeal.carbs}
                        onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fat">Fat (g)</Label>
                      <Input
                        id="fat"
                        type="number"
                        placeholder="15"
                        value={newMeal.fat}
                        onChange={(e) => setNewMeal({ ...newMeal, fat: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={addMeal} className="w-full bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Meal
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Meals List and Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Calories</p>
                      <p className="text-2xl font-bold">{Math.round(totals.calories)}</p>
                      <p className="text-xs text-muted-foreground">of {dailyTargets.calories}</p>
                    </div>
                    <Target className="h-8 w-8 text-orange-500" />
                  </div>
                  <Progress value={getPercentage(totals.calories, dailyTargets.calories)} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Protein</p>
                      <p className="text-2xl font-bold">{Math.round(totals.protein)}g</p>
                      <p className="text-xs text-muted-foreground">of {dailyTargets.protein}g</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                  </div>
                  <Progress value={getPercentage(totals.protein, dailyTargets.protein)} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Carbs</p>
                      <p className="text-2xl font-bold">{Math.round(totals.carbs)}g</p>
                      <p className="text-xs text-muted-foreground">of {dailyTargets.carbs}g</p>
                    </div>
                    <Utensils className="h-8 w-8 text-green-500" />
                  </div>
                  <Progress value={getPercentage(totals.carbs, dailyTargets.carbs)} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Fat</p>
                      <p className="text-2xl font-bold">{Math.round(totals.fat)}g</p>
                      <p className="text-xs text-muted-foreground">of {dailyTargets.fat}g</p>
                    </div>
                    <Calculator className="h-8 w-8 text-purple-500" />
                  </div>
                  <Progress value={getPercentage(totals.fat, dailyTargets.fat)} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Meals by Type */}
            <div className="space-y-4">
              {mealTypes.map((mealType) => (
                <Card key={mealType}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="capitalize flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        {mealType}
                      </span>
                      <Badge variant="secondary">{mealsByType[mealType]?.length || 0} items</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {mealsByType[mealType]?.length > 0 ? (
                      <div className="space-y-3">
                        {mealsByType[mealType].map((meal) => (
                          <div key={meal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{meal.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {meal.time}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {meal.quantity} {meal.unit}
                              </p>
                              <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                                <span>{Math.round(meal.calories)} cal</span>
                                <span>P: {Math.round(meal.protein)}g</span>
                                <span>C: {Math.round(meal.carbs)}g</span>
                                <span>F: {Math.round(meal.fat)}g</span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMeal(meal.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No {mealType} items added yet</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Daily Summary */}
            {meals.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Daily Summary</CardTitle>
                  <CardDescription>Your nutritional intake for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">{Math.round(totals.calories)}</p>
                      <p className="text-sm text-muted-foreground">Total Calories</p>
                      <p className="text-xs">{Math.round((totals.calories / dailyTargets.calories) * 100)}% of goal</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{Math.round(totals.protein)}g</p>
                      <p className="text-sm text-muted-foreground">Protein</p>
                      <p className="text-xs">{Math.round((totals.protein / dailyTargets.protein) * 100)}% of goal</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{Math.round(totals.carbs)}g</p>
                      <p className="text-sm text-muted-foreground">Carbohydrates</p>
                      <p className="text-xs">{Math.round((totals.carbs / dailyTargets.carbs) * 100)}% of goal</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{Math.round(totals.fat)}g</p>
                      <p className="text-sm text-muted-foreground">Fat</p>
                      <p className="text-xs">{Math.round((totals.fat / dailyTargets.fat) * 100)}% of goal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardClient 