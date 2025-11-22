import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LightColors } from '../../styles/colors';
import { Quiz, QuizLevel, Question, LevelLabels } from '../../models/Quiz';
import { QuizCategory, CategoryLabels } from '../../models/Category';
import { QuizService } from '../../services/api/quiz.service';
import { useAuth } from '../../context/AuthContext';

const EditQuizScreen = ({ route, navigation }: any) => {
  const { quizId } = route.params;
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Quiz metadata
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<QuizCategory>(QuizCategory.GENERAL);
  const [level, setLevel] = useState<QuizLevel>(QuizLevel.BASIC);
  const [isPublic, setIsPublic] = useState(true);

  // Questions
  const [questions, setQuestions] = useState<Question[]>([]);

  // UI State
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showLevelPicker, setShowLevelPicker] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0);

  // Load quiz data
  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      console.log('🔵 Cargando quiz para editar:', quizId);
      const quiz = await QuizService.getQuiz(quizId);

      // Verify user is the creator
      if (quiz.createdBy?.userId !== user?.id) {
        Alert.alert('Error', 'No tienes permiso para editar este quiz');
        navigation.goBack();
        return;
      }

      // Load quiz data
      setTitle(quiz.title);
      setDescription(quiz.description);
      setCategory(quiz.category as QuizCategory);
      setLevel(quiz.level as QuizLevel);
      setIsPublic(quiz.isPublic);
      setQuestions(quiz.questions);

      console.log('✅ Quiz cargado para edición');
    } catch (error: any) {
      console.error('❌ Error al cargar quiz:', error);
      Alert.alert('Error', 'No se pudo cargar el quiz');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  // Add new question
  const addQuestion = () => {
    const newQuestion: Question = {
      questionId: `q${Date.now()}_${questions.length}`,
      question: '',
      type: 'multiple',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 10,
    };
    setQuestions([...questions, newQuestion]);
    setExpandedQuestion(questions.length);
  };

  // Remove question
  const removeQuestion = (index: number) => {
    if (questions.length === 1) {
      Alert.alert('Error', 'Debes tener al menos una pregunta');
      return;
    }

    Alert.alert(
      'Confirmar',
      '¿Estás seguro de eliminar esta pregunta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const newQuestions = questions.filter((_, i) => i !== index);
            setQuestions(newQuestions);
            if (expandedQuestion === index) {
              setExpandedQuestion(null);
            }
          },
        },
      ]
    );
  };

  // Update question
  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions];
    (newQuestions[index] as any)[field] = value;
    setQuestions(newQuestions);
  };

  // Update option
  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  // Add option
  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].options.length >= 6) {
      Alert.alert('Límite alcanzado', 'Máximo 6 opciones por pregunta');
      return;
    }
    newQuestions[questionIndex].options.push('');
    setQuestions(newQuestions);
  };

  // Remove option
  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].options.length <= 2) {
      Alert.alert('Error', 'Debes tener al menos 2 opciones');
      return;
    }

    // Adjust correct answer if needed
    if (newQuestions[questionIndex].correctAnswer === optionIndex) {
      newQuestions[questionIndex].correctAnswer = 0;
    } else if (newQuestions[questionIndex].correctAnswer > optionIndex) {
      newQuestions[questionIndex].correctAnswer--;
    }

    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  // Validate quiz
  const validateQuiz = (): string | null => {
    if (!title.trim()) return 'Debes ingresar un título';
    if (!description.trim()) return 'Debes ingresar una descripción';
    if (questions.length === 0) return 'Debes tener al menos una pregunta';

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) return `Pregunta ${i + 1}: Debes ingresar el texto de la pregunta`;
      if (q.options.length < 2) return `Pregunta ${i + 1}: Debes tener al menos 2 opciones`;

      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) return `Pregunta ${i + 1}, Opción ${j + 1}: No puede estar vacía`;
      }

      if (q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
        return `Pregunta ${i + 1}: Respuesta correcta inválida`;
      }
    }

    return null;
  };

  // Save quiz
  const handleSaveQuiz = async () => {
    // Validate
    const error = validateQuiz();
    if (error) {
      Alert.alert('Validación', error);
      return;
    }

    try {
      setSaving(true);
      console.log('🔵 Actualizando quiz...');

      // Clean questions (remove undefined fields)
      const cleanQuestions: Question[] = questions.map((q) => {
        const question: Question = {
          questionId: q.questionId,
          question: q.question,
          type: q.type,
          options: q.options,
          correctAnswer: q.correctAnswer,
          points: q.points,
        };

        // Only add optional fields if they have values
        if (q.explanation) {
          question.explanation = q.explanation;
        }
        if (q.imageURL) {
          question.imageURL = q.imageURL;
        }

        return question;
      });

      // Update quiz
      const updateData: Partial<Quiz> = {
        title: title.trim(),
        description: description.trim(),
        category,
        level,
        isPublic,
        questions: cleanQuestions,
      };

      await QuizService.updateQuiz(quizId, updateData);
      console.log('✅ Quiz actualizado');

      navigation.goBack();
      Alert.alert('¡Éxito!', 'Quiz actualizado correctamente');
    } catch (error: any) {
      console.error('❌ Error al actualizar quiz:', error);
      Alert.alert('Error', error.message || 'No se pudo actualizar el quiz');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={LightColors.primary} />
        <Text style={styles.loadingText}>Cargando quiz...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Editar Quiz</Text>
          <Text style={styles.headerSubtitle}>
            Modifica la información y preguntas
          </Text>
        </View>

        {/* Quiz Metadata */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información General</Text>

          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Quiz de Matemáticas Básicas"
              placeholderTextColor={LightColors.textTertiary}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe de qué trata este quiz..."
              placeholderTextColor={LightColors.textTertiary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoría</Text>
            <TouchableOpacity
              style={styles.picker}
              onPress={() => setShowCategoryPicker(!showCategoryPicker)}
            >
              <Text style={styles.pickerText}>{CategoryLabels[category]}</Text>
              <Icon
                name={showCategoryPicker ? 'chevron-up' : 'chevron-down'}
                size={24}
                color={LightColors.textSecondary}
              />
            </TouchableOpacity>
            {showCategoryPicker && (
              <View style={styles.pickerOptions}>
                {Object.values(QuizCategory).map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={styles.pickerOption}
                    onPress={() => {
                      setCategory(cat);
                      setShowCategoryPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        category === cat && styles.pickerOptionTextSelected,
                      ]}
                    >
                      {CategoryLabels[cat]}
                    </Text>
                    {category === cat && (
                      <Icon name="check" size={20} color={LightColors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Level */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nivel de Dificultad</Text>
            <TouchableOpacity
              style={styles.picker}
              onPress={() => setShowLevelPicker(!showLevelPicker)}
            >
              <Text style={styles.pickerText}>{LevelLabels[level]}</Text>
              <Icon
                name={showLevelPicker ? 'chevron-up' : 'chevron-down'}
                size={24}
                color={LightColors.textSecondary}
              />
            </TouchableOpacity>
            {showLevelPicker && (
              <View style={styles.pickerOptions}>
                {Object.values(QuizLevel).map((lv) => (
                  <TouchableOpacity
                    key={lv}
                    style={styles.pickerOption}
                    onPress={() => {
                      setLevel(lv);
                      setShowLevelPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        level === lv && styles.pickerOptionTextSelected,
                      ]}
                    >
                      {LevelLabels[lv]}
                    </Text>
                    {level === lv && (
                      <Icon name="check" size={20} color={LightColors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Public/Private */}
          <View style={styles.switchRow}>
            <View style={styles.switchLabelContainer}>
              <Text style={styles.label}>Quiz Público</Text>
              <Text style={styles.switchDescription}>
                {isPublic
                  ? 'Todos pueden ver y tomar este quiz'
                  : 'Solo tú puedes ver este quiz'}
              </Text>
            </View>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: LightColors.disabled, true: LightColors.primaryLight }}
              thumbColor={isPublic ? LightColors.primary : LightColors.white}
            />
          </View>
        </View>

        {/* Questions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Preguntas ({questions.length})</Text>
            <TouchableOpacity style={styles.addButton} onPress={addQuestion}>
              <Icon name="plus" size={20} color={LightColors.white} />
              <Text style={styles.addButtonText}>Agregar</Text>
            </TouchableOpacity>
          </View>

          {questions.map((question, qIndex) => (
            <View key={question.questionId} style={styles.questionCard}>
              {/* Question Header */}
              <TouchableOpacity
                style={styles.questionHeader}
                onPress={() => setExpandedQuestion(expandedQuestion === qIndex ? null : qIndex)}
              >
                <Text style={styles.questionNumber}>Pregunta {qIndex + 1}</Text>
                <View style={styles.questionHeaderRight}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeQuestion(qIndex)}
                  >
                    <Icon name="delete" size={20} color={LightColors.error} />
                  </TouchableOpacity>
                  <Icon
                    name={expandedQuestion === qIndex ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color={LightColors.textSecondary}
                  />
                </View>
              </TouchableOpacity>

              {/* Question Content */}
              {expandedQuestion === qIndex && (
                <View style={styles.questionContent}>
                  {/* Question Text */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Pregunta *</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Escribe la pregunta..."
                      placeholderTextColor={LightColors.textTertiary}
                      value={question.question}
                      onChangeText={(text) => updateQuestion(qIndex, 'question', text)}
                      multiline
                    />
                  </View>

                  {/* Points */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Puntos</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="10"
                      placeholderTextColor={LightColors.textTertiary}
                      value={question.points.toString()}
                      onChangeText={(text) => {
                        const points = parseInt(text) || 10;
                        updateQuestion(qIndex, 'points', points);
                      }}
                      keyboardType="numeric"
                    />
                  </View>

                  {/* Options */}
                  <View style={styles.inputGroup}>
                    <View style={styles.optionsHeader}>
                      <Text style={styles.label}>Opciones</Text>
                      <TouchableOpacity
                        style={styles.addOptionButton}
                        onPress={() => addOption(qIndex)}
                      >
                        <Icon name="plus-circle" size={20} color={LightColors.primary} />
                        <Text style={styles.addOptionText}>Agregar opción</Text>
                      </TouchableOpacity>
                    </View>

                    {question.options.map((option, oIndex) => (
                      <View key={oIndex} style={styles.optionRow}>
                        <TouchableOpacity
                          style={[
                            styles.radioButton,
                            question.correctAnswer === oIndex && styles.radioButtonSelected,
                          ]}
                          onPress={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                        >
                          {question.correctAnswer === oIndex && (
                            <View style={styles.radioButtonInner} />
                          )}
                        </TouchableOpacity>

                        <TextInput
                          style={styles.optionInput}
                          placeholder={`Opción ${oIndex + 1}`}
                          placeholderTextColor={LightColors.textTertiary}
                          value={option}
                          onChangeText={(text) => updateOption(qIndex, oIndex, text)}
                        />

                        {question.options.length > 2 && (
                          <TouchableOpacity
                            style={styles.removeOptionButton}
                            onPress={() => removeOption(qIndex, oIndex)}
                          >
                            <Icon name="close-circle" size={20} color={LightColors.error} />
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}

                    <Text style={styles.optionHint}>
                      Selecciona el círculo para marcar la respuesta correcta
                    </Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={saving}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSaveQuiz}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={LightColors.white} />
          ) : (
            <>
              <Icon name="content-save" size={20} color={LightColors.white} />
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightColors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LightColors.background,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: LightColors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: LightColors.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: LightColors.white,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: LightColors.white,
    opacity: 0.9,
  },
  section: {
    padding: 20,
    borderBottomWidth: 8,
    borderBottomColor: LightColors.backgroundSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: LightColors.text,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: LightColors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: LightColors.surface,
    borderWidth: 1,
    borderColor: LightColors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: LightColors.text,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  picker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: LightColors.surface,
    borderWidth: 1,
    borderColor: LightColors.border,
    borderRadius: 8,
    padding: 12,
  },
  pickerText: {
    fontSize: 16,
    color: LightColors.text,
  },
  pickerOptions: {
    backgroundColor: LightColors.surface,
    borderWidth: 1,
    borderColor: LightColors.border,
    borderRadius: 8,
    marginTop: 5,
  },
  pickerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: LightColors.borderLight,
  },
  pickerOptionText: {
    fontSize: 16,
    color: LightColors.text,
  },
  pickerOptionTextSelected: {
    color: LightColors.primary,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  switchLabelContainer: {
    flex: 1,
  },
  switchDescription: {
    fontSize: 12,
    color: LightColors.textSecondary,
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LightColors.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  addButtonText: {
    color: LightColors.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  questionCard: {
    backgroundColor: LightColors.surface,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: LightColors.border,
    overflow: 'hidden',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: LightColors.backgroundSecondary,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: LightColors.text,
  },
  questionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deleteButton: {
    padding: 5,
  },
  questionContent: {
    padding: 15,
  },
  optionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  addOptionText: {
    fontSize: 14,
    color: LightColors.primary,
    fontWeight: '600',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: LightColors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: LightColors.success,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: LightColors.success,
  },
  optionInput: {
    flex: 1,
    backgroundColor: LightColors.backgroundSecondary,
    borderWidth: 1,
    borderColor: LightColors.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: LightColors.text,
  },
  removeOptionButton: {
    padding: 5,
  },
  optionHint: {
    fontSize: 12,
    color: LightColors.textSecondary,
    fontStyle: 'italic',
    marginTop: 5,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: LightColors.surface,
    borderTopWidth: 1,
    borderTopColor: LightColors.border,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: LightColors.backgroundSecondary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: LightColors.text,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: LightColors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: LightColors.white,
  },
});

export default EditQuizScreen;
