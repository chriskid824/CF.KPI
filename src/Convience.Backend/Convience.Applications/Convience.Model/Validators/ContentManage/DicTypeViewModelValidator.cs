using Convience.Model.Models.ContentManage;

using FluentValidation;

namespace Convience.Model.Validators.ContentManage
{
    public class DicTypeViewModelValidator : AbstractValidator<DicTypeViewModel>
    {
        public DicTypeViewModelValidator()
        {
            RuleFor(viewmodel => viewmodel.Name).NotEmpty().NotNull()
                .WithMessage("�ֵ�����������Ϊ�գ�");
            RuleFor(viewmodel => viewmodel.Code).NotEmpty().NotNull()
                .WithMessage("�ֵ����ͱ��벻��Ϊ�գ�");
            RuleFor(viewmodel => viewmodel.Name).MaximumLength(15)
                .WithMessage("�ֵ����������Ȳ��ܳ���15��");
            RuleFor(viewmodel => viewmodel.Code).MaximumLength(15)
                .WithMessage("�ֵ����ͱ��볤�Ȳ��ܳ���15��");
            RuleFor(viewmodel => viewmodel.Sort).LessThan(999999999)
                .WithMessage("�ֵ����ͱ������򳤶ȹ�����");
        }
    }
}